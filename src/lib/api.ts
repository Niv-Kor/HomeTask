import type {
  Policy,
  PolicyListResponse,
  TestCase,
  TestCaseResponse,
} from "@/types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return res.json();
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function getPolicies(signal?: AbortSignal) {
  const data = await request<PolicyListResponse>("/policies", { signal });
  return data.items;
}

export async function getPolicy(id: string, signal?: AbortSignal) {
  return request<Policy>(`/policies/${id}`, { signal });
}

/**
 * Fetches test cases for a policy.
 * Returns { tests: TestCase[], total: number, page: number }
 * Supports pagination via ?page=N query parameter.
 */
export async function getTestCases(
  policyId: string,
  signal?: AbortSignal
): Promise<TestCase[]> {
  const data = await request<TestCaseResponse>(
    `/policies/${policyId}/tests`,
    { signal }
  );
  return data.items;
}

export async function createTestCase(
  policyId: string,
  payload: {
    name: string;
    category: string;
    prompt: string;
    expectedSentiment: string;
    expectedKeywords: string[];
  }
) {
  return request<{ data: { test: TestCase } }>(`/policies/${policyId}/tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function runTestCase(
  policyId: string,
  testId: string,
  signal?: AbortSignal
) {
  return request<TestCase>(`/policies/${policyId}/tests/${testId}/run`, {
    method: "POST",
    signal,
  });
}
