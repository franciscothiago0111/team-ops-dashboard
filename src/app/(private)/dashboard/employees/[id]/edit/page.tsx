import { EmployeeEdit } from "../../_components/EmployeeEdit";

interface IEmployeeEditRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeEditRoute({ params }: IEmployeeEditRouteProps) {
  const { id } = await params;
  return <EmployeeEdit id={id} />;
}
