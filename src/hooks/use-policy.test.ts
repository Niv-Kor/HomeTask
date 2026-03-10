import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePolicy } from "./use-policy";

const mockPolicy = {
  id: "pol-1",
  name: "Test Policy",
  description: "A test policy",
  status: "active" as const,
  categories: [{ id: "cat-1", label: "Billing" }],
  updatedAt: "2026-01-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
};

vi.mock("@/lib/api", () => ({
  getPolicy: vi.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { getPolicy } from "@/lib/api";
const mockedGetPolicy = vi.mocked(getPolicy);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("usePolicy", () => {
  it("returns loading=true initially, then the policy", async () => {
    mockedGetPolicy.mockResolvedValue(mockPolicy);

    const { result } = renderHook(() => usePolicy("pol-1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.policy).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.policy).toEqual(mockPolicy);
    expect(result.current.error).toBeNull();
  });

  it("sets error when the API call fails", async () => {
    mockedGetPolicy.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => usePolicy("pol-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.policy).toBeNull();
    expect(result.current.error).toBe("Failed to load policy");
  });

  it("does not fetch when id is undefined", async () => {
    const { result } = renderHook(() => usePolicy(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedGetPolicy).not.toHaveBeenCalled();
    expect(result.current.policy).toBeNull();
  });

  it("aborts the request on unmount", () => {
    mockedGetPolicy.mockReturnValue(new Promise(() => {}));

    const abortSpy = vi.spyOn(AbortController.prototype, "abort");
    const { unmount } = renderHook(() => usePolicy("pol-1"));

    unmount();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
