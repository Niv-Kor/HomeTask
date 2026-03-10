import express from "express";
import cors from "cors";
import { policies, testCases, createTestCase } from "./seed.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- Policies ---

app.get("/api/policies", (_req, res) => {
  res.json({ items: policies });
});

app.get("/api/policies/:id", (req, res) => {
  const policy = policies.find((p) => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: "Policy not found" });
  res.json(policy);
});

// --- Test cases ---

app.get("/api/policies/:id/tests", (req, res) => {
  const policy = policies.find((p) => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: "Policy not found" });

  if (policy.status === "draft") {
    return res.status(403).json({ error: "Cannot test draft policies" });
  }

  const items = testCases.filter((t) => t.policyId === req.params.id);

  // simulate realistic network latency
  setTimeout(() => {
    res.json({ items });
  }, 300 + Math.random() * 200);
});

app.post("/api/policies/:id/tests", (req, res) => {
  const policy = policies.find((p) => p.id === req.params.id);
  if (!policy) return res.status(404).json({ error: "Policy not found" });

  const { name, category, prompt, expectedSentiment, expectedKeywords } =
    req.body;

  if (!name || !prompt) {
    return res.status(400).json({ error: "name and prompt are required" });
  }

  const test = createTestCase(policy.id, {
    name,
    category: category || "General",
    prompt,
    expectedSentiment: expectedSentiment || "neutral",
    expectedKeywords: expectedKeywords || [],
  });

  // intentionally nested response shape
  res.status(201).json({ data: { test } });
});

// --- Run a test ---

app.post("/api/policies/:id/tests/:testId/run", (req, res) => {
  const test = testCases.find(
    (t) => t.policyId === req.params.id && t.id === req.params.testId
  );

  if (!test) return res.status(404).json({ error: "Test not found" });

  // simulate LLM execution delay (2-4s)
  const delay = 2000 + Math.random() * 2000;

  setTimeout(() => {
    const passed = Math.random() > 0.3;
    test.status = passed ? "passed" : "failed";
    test.score = passed ? 70 + Math.random() * 30 : 20 + Math.random() * 40;
    test.agentResponse = passed
      ? "The agent responded appropriately to the test scenario."
      : "The agent's response did not meet the expected criteria.";

    res.json(test);
  }, delay);
});

app.get("/api/policies/:id/tests/:testId", (req, res) => {
  const test = testCases.find(
    (t) => t.policyId === req.params.id && t.id === req.params.testId
  );
  if (!test) return res.status(404).json({ error: "Test not found" });
  res.json(test);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
