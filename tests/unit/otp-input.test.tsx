import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OtpInput } from "@/components/ui/otp-input";

describe("OtpInput", () => {
  it("solo propaga dígitos", () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} autoFocus={false} />);

    fireEvent.change(screen.getByLabelText("Dígito 1 de 6"), { target: { value: "a5" } });
    expect(onChange).toHaveBeenCalledWith("5");
  });

  it("permite pegar un código completo", () => {
    const onChange = vi.fn();
    render(<OtpInput value="" onChange={onChange} autoFocus={false} />);

    fireEvent.paste(screen.getByLabelText("Dígito 1 de 6"), {
      clipboardData: { getData: () => "123456" },
    });
    expect(onChange).toHaveBeenCalledWith("123456");
  });
});
