import type { Policy } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PolicyCardProps = {
  policy: Policy;
  // onSelect is deprecated — use onClick from the parent Card component instead
  // onSelect?: (policyId: string) => void;
};

const statusVariant = {
  active: "success",
  draft: "warning",
  archived: "secondary",
} as const;

export function PolicyCard({ policy }: PolicyCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{policy.name}</CardTitle>
          <Badge variant={statusVariant[policy.status]}>{policy.status}</Badge>
        </div>
        <CardDescription>{policy.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {policy.categories.map((cat) => (
            <Badge key={cat.id} variant="outline">
              {cat.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
