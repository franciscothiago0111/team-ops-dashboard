import Link from "next/link";
import { SignupForm } from "./_components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 text-2xl font-bold text-white shadow-lg">
            T
          </div>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            Crie sua Conta
          </h1>
          <p className="text-slate-600">
            Comece a gerenciar sua equipe hoje mesmo
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-slate-700">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-slate-700">
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
