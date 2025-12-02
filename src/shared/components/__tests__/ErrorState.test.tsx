import { render, screen } from "@testing-library/react";
import { ErrorState } from "../ErrorState";
import userEvent from "@testing-library/user-event";

const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe("ErrorState", () => {
  beforeEach(() => {
    mockBack.mockClear();
  });

  it("renders default error message", () => {
    render(<ErrorState />);

    expect(screen.getByText("Não foi possível carregar os dados.")).toBeInTheDocument();
  });

  it("renders custom error message", () => {
    render(<ErrorState message="Erro ao buscar usuário" />);

    expect(screen.getByText("Erro ao buscar usuário")).toBeInTheDocument();
  });

  it("shows back button by default", () => {
    render(<ErrorState />);

    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
  });

  it("hides back button when showBackButton is false", () => {
    render(<ErrorState showBackButton={false} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows custom back button text", () => {
    render(<ErrorState backButtonText="Retornar" />);

    expect(screen.getByRole("button", { name: /retornar/i })).toBeInTheDocument();
  });

  it("calls router.back when back button is clicked", async () => {
    const user = userEvent.setup();
    render(<ErrorState />);

    const button = screen.getByRole("button", { name: /voltar/i });
    await user.click(button);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("calls custom onBack handler when provided", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();
    render(<ErrorState onBack={onBack} />);

    const button = screen.getByRole("button", { name: /voltar/i });
    await user.click(button);

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(mockBack).not.toHaveBeenCalled();
  });

  it("renders error icon", () => {
    const { container } = render(<ErrorState />);

    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
