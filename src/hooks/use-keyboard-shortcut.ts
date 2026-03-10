import { useEffect } from "react";

/**
 * Registers a global keyboard shortcut. The callback fires when
 * the given key combo is pressed (e.g. "ctrl+k", "Escape").
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const parts = key.toLowerCase().split("+");
      const mainKey = parts.pop()!;
      const needsCtrl = parts.includes("ctrl") || parts.includes("meta");
      const needsShift = parts.includes("shift");

      const ctrlMatch = needsCtrl ? e.ctrlKey || e.metaKey : true;
      const shiftMatch = needsShift ? e.shiftKey : true;
      const keyMatch = e.key.toLowerCase() === mainKey;

      if (ctrlMatch && shiftMatch && keyMatch) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);
}
