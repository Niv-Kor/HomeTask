import { Outlet, Link, useLocation } from "react-router-dom";
import { FileText, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

// Components: import from @/components/ui/* for shadcn primitives
// Custom components are in @/components/custom/*

const navItems = [
  { to: "/policies", label: "Policies", icon: FileText },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r bg-card flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Notch Test Lab</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
