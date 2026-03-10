import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { NameField } from "./name-field";

describe("NameField", () => {
  it("renders the label and input", () => {
    render(<NameField value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Test name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/happy path/i)).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<NameField value="My test" onChange={() => {}} />);

    expect(screen.getByDisplayValue("My test")).toBeInTheDocument();
  });

  it("calls onChange when the user types", async () => {
    const handleChange = vi.fn();
    render(<NameField value="" onChange={handleChange} />);

    const input = screen.getByLabelText("Test name");
    await userEvent.type(input, "a");

    expect(handleChange).toHaveBeenCalledWith("a");
  });
});
