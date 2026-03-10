import { useEffect, useState } from "react";
import { getPolicy, ApiError } from "@/lib/api";
import type { Policy } from "@/types";

export function usePolicy(id: string | undefined) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setError(null);

    const controller = new AbortController();

    getPolicy(id, controller.signal)
      .then((data) => {
        setPolicy(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof ApiError ? err.message : "Failed to load policy";
        setError(message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return { policy, loading, error };
}
