import { render, screen } from "@testing-library/react";
import { InfoField } from "../InfoField";

describe("InfoField", () => {
  it("renders label and value correctly", () => {
    render(<InfoField label="Email" value="test@example.com" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows placeholder when value is null", () => {
    render(<InfoField label="Phone" value={null} />);

    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows placeholder when value is undefined", () => {
    render(<InfoField label="Address" value={undefined} />);

    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows custom placeholder", () => {
    render(<InfoField label="Status" value={null} placeholder="N/A" />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders numeric value correctly", () => {
    render(<InfoField label="Age" value={25} />);

    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("shows placeholder for empty string", () => {
    render(<InfoField label="Notes" value="" />);

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
