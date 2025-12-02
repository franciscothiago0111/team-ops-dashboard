import { EmployeeEdit } from "../../_components/EmployeeEdit";

interface EmployeeEditRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeEditRoute({ params }: EmployeeEditRouteProps) {
  const { id } = await params;
  return <EmployeeEdit id={id} />;
}
