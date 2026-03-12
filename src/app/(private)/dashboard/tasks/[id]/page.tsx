"use client";

import { use } from "react";
import { TaskDetails } from "../_components/TaskDetails";

interface TaskPageProps {
  params: Promise<{ id: string }>;
}

export default function TaskPage({ params }: TaskPageProps) {
  const { id } = use(params);

  return <TaskDetails id={id} />;
}
