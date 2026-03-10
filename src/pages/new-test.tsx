import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePolicy } from "@/hooks/use-policy";

export function NewTestPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { policy, loading: policyLoading } = usePolicy(policyId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

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

      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium block mb-1.5">
            Test name
          </label>
          <Input
            id="name"
            placeholder="e.g. Happy path refund request"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium block mb-1.5">
            Category
          </label>
          <select
            id="category"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {policy?.categories.map((cat) => (
              <option key={cat.id} value={cat.label}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={!name.trim()}>
            Create test case
          </Button>
          <Link to={`/policies/${policyId}/tests`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
