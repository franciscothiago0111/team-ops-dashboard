"use client";

import { use } from "react";
import { TeamEdit } from "../../_components/TeamEdit";

interface ITeamEditPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamEditPage({ params }: ITeamEditPageProps) {
  const { id } = use(params);

  return <TeamEdit id={id} />;
}
