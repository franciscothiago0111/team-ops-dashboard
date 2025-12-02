import { render, screen } from "@testing-library/react";
import { CancelButton } from "../CancelButton";
import userEvent from "@testing-library/user-event";

const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("CancelButton", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders with default text", () => {
    render(<CancelButton />);

    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<CancelButton text="Descartar" />);

    expect(screen.getByRole("button", { name: /descartar/i })).toBeInTheDocument();
  });

  it("has type button to prevent form submission", () => {
    render(<CancelButton />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("calls router.back when clicked", async () => {
    const user = userEvent.setup();
    render(<CancelButton />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("calls custom onClick handler when provided", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<CancelButton onClick={onClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<CancelButton className="w-full" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full");
  });
});
