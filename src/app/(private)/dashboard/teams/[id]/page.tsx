"use client";

import { use } from "react";
import { TeamDetails } from "../_components/TeamDetails";

interface ITeamPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamPage({ params }: ITeamPageProps) {
  const { id } = use(params);

  return <TeamDetails id={id} />;
}
