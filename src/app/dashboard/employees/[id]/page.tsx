import { EmployeeDetails } from "../_components/EmployeeDetails";

interface EmployeeRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailsRoute({ params }: EmployeeRouteProps) {
  const { id } = await params;
  return <EmployeeDetails id={id} />;
}
