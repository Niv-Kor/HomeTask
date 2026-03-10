import { Input } from "@/components/ui/input";

interface INameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const NameField = ({ value, onChange }: INameFieldProps) => {
  return (
    <div>
      <label htmlFor="name" className="text-sm font-medium block mb-1.5">
        Test name
      </label>
      <Input
        id="name"
        placeholder="e.g. Happy path refund request"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
