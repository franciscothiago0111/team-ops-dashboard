"use client";

import { use } from "react";
import { TeamDetails } from "../_components/TeamDetails";

interface TeamPageProps {
  params: Promise<{ id: string }>;
}

export default function TeamPage({ params }: TeamPageProps) {
  const { id } = use(params);

  return <TeamDetails id={id} />;
}
