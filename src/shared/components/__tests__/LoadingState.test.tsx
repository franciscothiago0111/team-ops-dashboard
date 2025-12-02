import { render, screen } from "@testing-library/react";
import { LoadingState } from "../LoadingState";

describe("LoadingState", () => {
  it("renders default loading message", () => {
    render(<LoadingState />);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("renders custom loading message", () => {
    render(<LoadingState message="Buscando dados..." />);

    expect(screen.getByText("Buscando dados...")).toBeInTheDocument();
  });

  it("renders spinner element", () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("has proper layout classes", () => {
    const { container } = render(<LoadingState />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "justify-center", "py-12");
  });
});
