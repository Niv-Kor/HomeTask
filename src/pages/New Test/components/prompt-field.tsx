import { useRef } from "react";

const TEMPLATE_VARS = [
  "customer_name",
  "account_id",
  "order_id",
  "email",
  "product_name",
];

interface IPromptFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const PromptField = ({ value, onChange }: IPromptFieldProps) => {
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const insertVariable = (varName: string) => {
    const textarea = promptRef.current;
    if (!textarea) return;

    const tag = `{{${varName}}}`;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    onChange(value.slice(0, start) + tag + value.slice(end));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + tag.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  return (
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
