import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePolicy } from "@/hooks/use-policy";
import type { Sentiment } from "@/types";
import { NameField } from "./components/name-field";
import { CategoryField } from "./components/category-field";
import { PromptField } from "./components/prompt-field";
import { ExpectedOutcomeField } from "./components/expected-outcome-field";

export const NewTestPage = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const { policy, loading: policyLoading } = usePolicy(policyId);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");
  const [expectedSentiment, setExpectedSentiment] = useState<Sentiment>("neutral");
  const [expectedKeywords, setExpectedKeywords] = useState<string[]>([]);

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
