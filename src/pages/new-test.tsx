import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NewTestPage() {
  const { policyId } = useParams<{ policyId: string }>();

  return (
    <div>
      <Link
        to={`/policies/${policyId}/tests`}
        className="text-sm text-muted-foreground hover:underline"
      >
        Back to tests
      </Link>
      <h1 className="text-2xl font-bold mt-1 mb-6">New Test Case</h1>

      <p className="text-muted-foreground">
        Implement the multi-step test case creation form here.
      </p>

      <div className="mt-4">
        <Link to={`/policies/${policyId}/tests`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
    </div>
  );
}
