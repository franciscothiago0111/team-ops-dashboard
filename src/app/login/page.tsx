import { Card } from "@/core/ui/Card";
import { LoginForm } from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-12 rounded-4xl bg-white/60 p-8 shadow-xl shadow-slate-200 backdrop-blur md:grid-cols-2 md:p-16">
        <section className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Team Ops Dashboard
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Organize times, operações e pessoas em um só lugar.
            </h1>
            <p className="text-base text-slate-600">
              Entre na plataforma para registrar colaboradores, acompanhar indicadores
              e conduzir processos com segurança empresarial.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card title="100% SaaS" description="Camadas modulares prontas para escalar" />
            <Card title="Segurança" description="Autenticação com interceptors e tokens" />
          </div>

          <div className="pt-4">
            <p className="text-sm text-slate-600">
              Ainda não tem uma conta?{" "}
              <a
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Criar conta gratuita
              </a>
            </p>
          </div>
        </section>

        <section>
          <Card title="Acesse sua conta" description="Use suas credenciais corporativas">
            <LoginForm />
          </Card>
        </section>
      </div>
    </main>
  );
}
