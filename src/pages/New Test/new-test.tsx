import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePolicy } from "@/hooks/use-policy";
import { createTestCase, ApiError } from "@/lib/api";
import type { Sentiment } from "@/types";
import { Loader2 } from "lucide-react";
import { NameField } from "./components/name-field";
import { CategoryField } from "./components/category-field";
import { PromptField } from "./components/prompt-field";
import { ExpectedOutcomeField } from "./components/expected-outcome-field";

export const NewTestPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { policy, loading: policyLoading } = usePolicy(policyId);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [expectedSentiment, setExpectedSentiment] = useState<Sentiment>("neutral");
  const [expectedKeywords, setExpectedKeywords] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!policyId || !name.trim() || !prompt.trim()) return;

    setSubmitting(true);
    setError(null);

    const optimisticTest = {
      id: `optimistic-${Date.now()}`,
      policyId,
      name: name.trim(),
      category: category || (policy?.categories[0]?.label ?? "General"),
      prompt: prompt.trim(),
      expectedSentiment,
      expectedKeywords,
      status: "pending" as const,
      score: null,
      agentResponse: null,
      createdAt: new Date().toISOString(),
    };

    navigate(`/policies/${policyId}/tests`, { state: { optimisticTest } });

    try {
      await createTestCase(policyId, {
        name: optimisticTest.name,
        category: optimisticTest.category,
        prompt: optimisticTest.prompt,
        expectedSentiment,
        expectedKeywords,
      });
    }
    catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to create test case";
      setError(message);
      setSubmitting(false);
    }
  }

  if (policyLoading) {
    return (
      <div className="text-muted-foreground py-12 text-center">Loading...</div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        to={`/policies/${policyId}/tests`}
        className="text-sm text-muted-foreground hover:underline"
      >
        &larr; Back to tests
      </Link>
      <h1 className="text-2xl font-bold mt-1 mb-6">New Test Case</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <NameField value={name} onChange={setName} />
        <CategoryField
          value={category}
          onChange={setCategory}
          categories={policy?.categories ?? []}
        />
        <PromptField value={prompt} onChange={setPrompt} />
        <ExpectedOutcomeField
          sentiment={expectedSentiment}
          onSentimentChange={setExpectedSentiment}
          keywords={expectedKeywords}
          onKeywordsChange={setExpectedKeywords}
        />
        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting || !name.trim() || !prompt.trim()}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {submitting ? "Creating…" : "Create test case"}
          </Button>
          <Link to={`/policies/${policyId}/tests`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
