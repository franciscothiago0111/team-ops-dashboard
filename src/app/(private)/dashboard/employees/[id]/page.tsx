import { EmployeeDetails } from "../_components/EmployeeDetails";

interface IEmployeeRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailsRoute({ params }: IEmployeeRouteProps) {
  const { id } = await params;
  return <EmployeeDetails id={id} />;
}
