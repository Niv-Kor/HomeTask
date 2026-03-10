import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTestCases, ApiError } from "@/lib/api";
import { usePolicy } from "@/hooks/use-policy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TestStatus, type TestCase } from "@/types";

function statusBadge(status: TestStatus) {
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

  if (policyLoading || loading) {
    return (
      <div className="text-muted-foreground py-12 text-center">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive mb-4">{error}</p>
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
                <th className="px-4 py-3 font-medium" />
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
                    {/* TODO: add run button */}
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
