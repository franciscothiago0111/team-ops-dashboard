import { Card } from "@/core/ui/Card";
import { BarcodeScanner } from "./_components/BarcodeScanner";

export default function ScanTestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-12">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-12 rounded-4xl bg-white/60 p-8 shadow-2xl shadow-slate-300 backdrop-blur md:grid-cols-2 md:p-16">
        <section className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              Barcode Scanner Test
            </span>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              Escaneie códigos de barras com facilidade
            </h1>
            <p className="text-base text-slate-600">
              Use a câmera do seu dispositivo para ler códigos EAN.
              Todos os códigos escaneados serão listados e podem ser enviados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card
              title="EAN Support"
              description="Leitura de códigos EAN-8 e EAN-13"
            />
            <Card
              title="Tempo Real"
              description="Detecção automática e instantânea"
            />
          </div>

          <div className="space-y-3 rounded-lg bg-white/50 p-4">
            <h3 className="font-semibold text-slate-800">Como usar:</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  1
                </span>
                <span>Permita o acesso à câmera quando solicitado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  2
                </span>
                <span>Aponte para um código de barras EAN</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  3
                </span>
                <span>Os códigos serão detectados automaticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  4
                </span>
                <span>Clique em &quot;Enviar Códigos&quot; para submeter</span>
              </li>
            </ul>
          </div>
        </section>

        <section>
          <Card
            title="Escaneamento de Códigos"
            description="Inicie a câmera e comece a escanear"
          >
            <BarcodeScanner />
          </Card>
        </section>
      </div>
    </main>
  );
}
