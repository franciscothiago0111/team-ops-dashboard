"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";
import { Button } from "@/core/ui/Button";
import { Badge } from "@/core/ui/Badge";

interface IScannedBarcode {
  code: string;
  timestamp: Date;
  format: string;
}

export function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<IScannedBarcode[]>([]);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    // Initialize reader with EAN formats
    readerRef.current = new BrowserMultiFormatReader();
    readerRef.current.hints.set(2, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
    ]);

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setError("");
      setIsScanning(true);

      if (!readerRef.current || !videoRef.current) return;

      await readerRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result) => {
          if (result) {
            const code = result.getText();
            const format = result.getBarcodeFormat().toString();

            // Avoid duplicate consecutive scans
            if (code !== lastScannedCode) {
              setLastScannedCode(code);
              setScannedCodes((prev) => [
                { code, timestamp: new Date(), format },
                ...prev,
              ]);

              // Play a beep sound (optional)
              playBeep();
            }
          }
        }
      );
    } catch (err) {
      setError("Erro ao acessar a câmera. Verifique as permissões.");
      setIsScanning(false);
      console.error(err);
    }
  };

  const playBeep = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.1;

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  };

  const clearCodes = () => {
    setScannedCodes([]);
    setLastScannedCode("");
  };

  const removeCode = (index: number) => {
    setScannedCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (scannedCodes.length === 0) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Submitting barcodes:", scannedCodes);
    alert(
      `${scannedCodes.length} código(s) enviado(s) com sucesso!\n\n` +
      scannedCodes.map((s) => `${s.code} (${s.format})`).join("\n")
    );

    setIsSubmitting(false);
    clearCodes();
  };

  return (
    <div className="space-y-6">
      {/* Camera Preview */}
      <div className="relative overflow-hidden rounded-lg bg-slate-900">
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80">
            <div className="text-center text-white">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm">Câmera desativada</p>
            </div>
          </div>
        )}
        {isScanning && (
          <div className="absolute top-4 right-4">
            <Badge variant="success">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                Escaneando
              </span>
            </Badge>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isScanning ? (
          <Button onClick={startScanning} className="flex-1">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Iniciar Câmera
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="secondary" className="flex-1">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
              />
            </svg>
            Parar Câmera
          </Button>
        )}
      </div>

      {/* Scanned Codes List */}
      {scannedCodes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              Códigos Escaneados ({scannedCodes.length})
            </h3>
            <button
              onClick={clearCodes}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Limpar Todos
            </button>
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
            {scannedCodes.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md bg-slate-50 p-3 transition-colors hover:bg-slate-100"
              >
                <div className="flex-1">
                  <p className="font-mono font-semibold text-slate-900">
                    {item.code}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.format} • {item.timestamp.toLocaleTimeString("pt-BR")}
                  </p>
                </div>
                <button
                  onClick={() => removeCode(index)}
                  className="ml-3 text-slate-400 hover:text-red-600"
                  aria-label="Remover código"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Enviar Códigos ({scannedCodes.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
