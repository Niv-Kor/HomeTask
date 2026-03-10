import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPolicies } from "@/lib/api";
import { PolicyCard } from "@/components/policy-card";
import { Button } from "@/components/ui/button";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import type { Policy } from "@/types";

type SortOrder = "newest" | "oldest" | "name";

export function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    getPolicies()
      .then((data) => {
        setPolicies(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // cycle sort order with ctrl+s
  useKeyboardShortcut("ctrl+s", () => {
    const next: Record<SortOrder, SortOrder> = {
      newest: "oldest",
      oldest: "name",
      name: "newest",
    };
    setSortOrder(prevSortOrder => next[prevSortOrder]);
  });

  const sorted = [...policies].sort((a, b) => {
    if (sortOrder === "name") {
      return a.name.localeCompare(b.name);
    }
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return <div className="text-muted-foreground py-12 text-center">Loading policies...</div>;
  }

  if (error) {
    return <div className="text-destructive py-12 text-center">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Policies</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Sort: {sortOrder}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const next: Record<SortOrder, SortOrder> = {
                newest: "oldest",
                oldest: "name",
                name: "newest",
              };
              setSortOrder(next[sortOrder]);
            }}
          >
            Toggle sort
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {sorted.map((policy) => (
          <Link key={policy.id} to={`/policies/${policy.id}/tests`}>
            <PolicyCard policy={policy} />
          </Link>
        ))}
      </div>
    </div>
  );
}
