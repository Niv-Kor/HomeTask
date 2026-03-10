import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTestCases, runTestCase, ApiError } from "@/lib/api";
import { Play, Loader2 } from "lucide-react";
import { usePolicy } from "@/hooks/use-policy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestStatus, type TestCase, ERROR_CONFIG, API_ERRORS } from "@/types";

const statusBadge = (status: TestStatus) => {
  const variant = {
    [TestStatus.Pending]: "secondary",
    [TestStatus.Running]: "warning",
    [TestStatus.Passed]: "success",
    [TestStatus.Failed]: "destructive",
  } as const;

  return <Badge variant={variant[status] ?? "outline"}>{status}</Badge>;
}

export function PolicyTestsPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { policy, loading: policyLoading } = usePolicy(policyId);
  const [tests, setTests] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!policyId) return;

    setLoading(true);
    setError(null);

    getTestCases(policyId)
      .then((data) => {
        setTests(data);
        setLoading(false);
      })
      .catch((err) => {
        const message =
          err instanceof ApiError ? err.message : "Failed to load tests";
        setError(message);
        setLoading(false);
      });
  }, [policyId]);

  const handleRun = async (testId: string) => {
    if (!policyId || runningTests.has(testId)) return;

    setRunningTests((prev) => new Set(prev).add(testId));

    try {
      //replace the old test with the updated one from the API
      const updatedTest = await runTestCase(policyId, testId);
      setTests((prev) => prev.map((test) => (test.id === testId ? updatedTest : test)));
    }
    catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to run test";
      alert(message);
    }
    finally {
      //remove from running set
      setRunningTests((prev) => {
        const next = new Set(prev);
        next.delete(testId);
        return next;
      });
    }
  }

  if (policyLoading || loading) {
    return (
      <div className="text-muted-foreground py-12 text-center">Loading...</div>
    );
  }

  if (error) {
    const errorConfig = ERROR_CONFIG[error as (typeof API_ERRORS)[keyof typeof API_ERRORS]];

    return (
      <div className="py-12 text-center">
        {errorConfig ? (
          <>
            <h2 className="text-lg font-semibold mb-1">{errorConfig.title}</h2>
            <p className="text-muted-foreground mb-4">{errorConfig.description}</p>
          </>
        ) : (
          <p className="text-destructive mb-4">{error}</p>
        )}
        <Link to="/policies">
          <Button variant="outline">Back to policies</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/policies"
            className="text-sm text-muted-foreground hover:underline"
          >
            Policies
          </Link>
          <h1 className="text-2xl font-bold">{policy?.name ?? "Policy"}</h1>
        </div>
        <Link to={`/policies/${policyId}/tests/new`}>
          <Button>New test case</Button>
        </Link>
      </div>

      {tests.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No test cases yet. Create one to get started.
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium w-32" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {tests.map((test) => (
                <tr key={test.id} className="text-sm">
                  <td className="px-4 py-3 font-medium">{test.name}</td>
                  <td className="px-4 py-3">{test.category}</td>
                  <td className="px-4 py-3">{statusBadge(test.status)}</td>
                  <td className="px-4 py-3">{test.score?.toFixed(1) ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(test.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={runningTests.has(test.id)}
                      onClick={() => handleRun(test.id)}
                    >
                      {runningTests.has(test.id) ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {runningTests.has(test.id) ? "Running…" : "Run"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
