import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Team Ops Dashboard",
  description: "Sign in or sign up to access Team Ops Dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
