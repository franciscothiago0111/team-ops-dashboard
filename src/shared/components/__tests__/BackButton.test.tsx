import { render, screen } from "@testing-library/react";
import { BackButton } from "../BackButton";
import userEvent from "@testing-library/user-event";

const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("BackButton", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders with default text", () => {
    render(<BackButton />);

    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<BackButton text="Retornar" />);

    expect(screen.getByRole("button", { name: /retornar/i })).toBeInTheDocument();
  });

  it("calls router.back when clicked", async () => {
    const user = userEvent.setup();
    render(<BackButton />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("calls custom onClick handler when provided", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<BackButton onClick={onClick} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<BackButton className="custom-class" />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("renders arrow icon", () => {
    const { container } = render(<BackButton />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
