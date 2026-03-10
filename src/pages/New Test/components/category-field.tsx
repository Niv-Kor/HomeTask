interface ICategory {
  id: string;
  label: string;
}

interface ICategoryFieldProps {
  value: string;
  onChange: (value: string) => void;
  categories: ICategory[];
}

export const CategoryField = ({ value, onChange, categories }: ICategoryFieldProps) => {
  return (
    <div>
      <label htmlFor="category" className="text-sm font-medium block mb-1.5">
        Category
      </label>
      <select
        id="category"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.label}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
