import { render, screen } from "@testing-library/react";
import { InputsGrid } from "../InputsGrid";

describe("InputsGrid", () => {
  it("renders children correctly", () => {
    render(
      <InputsGrid>
        <div>Child 1</div>
        <div>Child 2</div>
      </InputsGrid>
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies default 2 columns grid class", () => {
    const { container } = render(
      <InputsGrid>
        <div>Item</div>
      </InputsGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("grid", "gap-4", "md:grid-cols-2");
  });

  it("applies 1 column grid when specified", () => {
    const { container } = render(
      <InputsGrid cols={1}>
        <div>Item</div>
      </InputsGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("md:grid-cols-1");
  });

  it("applies 3 columns grid when specified", () => {
    const { container } = render(
      <InputsGrid cols={3}>
        <div>Item</div>
      </InputsGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("md:grid-cols-3");
  });

  it("applies 4 columns grid when specified", () => {
    const { container } = render(
      <InputsGrid cols={4}>
        <div>Item</div>
      </InputsGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("md:grid-cols-4");
  });

  it("applies custom className", () => {
    const { container } = render(
      <InputsGrid className="custom-class">
        <div>Item</div>
      </InputsGrid>
    );

    const grid = container.firstChild as HTMLElement;
    expect(grid).toHaveClass("custom-class");
  });
});
