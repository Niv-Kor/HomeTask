export type Policy = {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "archived";
  categories: { id: string; label: string }[];
  updatedAt: string | null;
  createdAt: string;
};

// status values returned by the API for test runs
export const TestStatus = {
  Pending: "pending",
  Running: "running",
  Passed: "passed",
  Failed: "failed",
} as const;

export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus];

export type TestCase = {
  id: string;
  name: string;
  policyId: string;
  category: string;
  prompt: string;
  expectedSentiment: "positive" | "neutral" | "negative";
  expectedKeywords: string[];
  status: TestStatus;
  score?: number;
  agentResponse: string | null;
  createdAt: string;
};

export type TestCaseResponse = {
  items: TestCase[];
};

export type PolicyListResponse = {
  items: Policy[];
};

export const API_ERRORS = {
  DRAFT_POLICY: "Cannot test draft policies",
} as const;

export const ERROR_CONFIG: Record<(typeof API_ERRORS)[keyof typeof API_ERRORS], { title: string; description: string }> = {
  [API_ERRORS.DRAFT_POLICY]: {
    title: "Policy not testable",
    description: "This policy is still in draft. Publish it before running tests.",
  },
};
