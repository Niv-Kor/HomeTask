import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePolicy } from "@/hooks/use-policy";

const TEMPLATE_VARS = [
    "customer_name",
    "account_id",
    "order_id",
    "email",
    "product_name"
];

export function NewTestPage() {
  const { policyId } = useParams<{ policyId: string }>();
  const { policy, loading: policyLoading } = usePolicy(policyId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (varName: string) => {
    const textarea = promptRef?.current;
    if (!textarea) return;

    const tag = `{{${varName}}}`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setPrompt(prev => prev.slice(0, start) + tag + prev.slice(end));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + tag.length;
      textarea.setSelectionRange(cursor, cursor);
    });
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

        <div>
          <label htmlFor="prompt" className="text-sm font-medium block mb-1.5">
            Prompt template
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-xs text-muted-foreground self-center mr-1">
              Insert variable:
            </span>
            {TEMPLATE_VARS.map((varName) => (
              <button
                key={varName}
                type="button"
                className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => insertVariable(varName)}
              >
                {`{{${varName}}}`}
              </button>
            ))}
          </div>
          <textarea
            ref={promptRef}
            id="prompt"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="e.g. Hi, my name is {{customer_name}} and I was charged twice for order {{order_id}}."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={!name.trim() || !prompt.trim()}>
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
