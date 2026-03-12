"use client";

import { use } from "react";
import { TeamEdit } from "../../_components/TeamEdit";

interface TeamEditPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamEditPage({ params }: TeamEditPageProps) {
  const { id } = use(params);

  return <TeamEdit id={id} />;
}
