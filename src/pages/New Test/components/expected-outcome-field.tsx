import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SENTIMENTS, type Sentiment } from "@/types";
import { X } from "lucide-react";

interface IExpectedOutcomeFieldProps {
  sentiment: Sentiment;
  onSentimentChange: (value: Sentiment) => void;
  keywords: string[];
  onKeywordsChange: (value: string[]) => void;
}

export const ExpectedOutcomeField = ({
  sentiment,
  onSentimentChange,
  keywords,
  onKeywordsChange,
}: IExpectedOutcomeFieldProps) => {
  const [keywordInput, setKeywordInput] = useState("");

  const addKeyword = () => {
    const trimmed = keywordInput.trim().toLowerCase();
    if (trimmed && !keywords.includes(trimmed)) {
      onKeywordsChange([...keywords, trimmed]);
    }
    setKeywordInput("");
  }

  return (
    <>
      <div>
        <label className="text-sm font-medium block mb-2">
          Expected sentiment
        </label>
        <div className="flex gap-2">
          {SENTIMENTS.map((s) => (
            <button
              key={s}
              type="button"
              className={`rounded-md border px-4 py-2 text-sm capitalize transition-colors ${
                sentiment === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background hover:bg-accent"
              }`}
              onClick={() => onSentimentChange(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="keywords" className="text-sm font-medium block mb-1.5">
          Expected keywords <span className="text-muted-foreground font-normal">(optional)</span>
        </label>
        <div className="flex gap-2">
          <Input
            id="keywords"
            placeholder="Type a keyword and press Enter"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addKeyword();
              }
            }}
          />
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="gap-1 pr-1">
                {kw}
                <button
                  type="button"
                  onClick={() => onKeywordsChange(keywords.filter((k) => k !== kw))}
                  className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
