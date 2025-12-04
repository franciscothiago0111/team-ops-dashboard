/**
 * usePDFDownload Hook
 * Reusable hook for generating and downloading PDFs
 */

import { useState } from 'react';
import { pdfService } from '@/core/services/pdf.service';
import { useAppToast } from '@/core/hooks/useToast';
import { PDFGenerationOptions } from '@/core/pdf/types';

interface UsePDFDownloadOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface GeneratePDFParams<T> {
  template: string;
  data: T;
  options?: PDFGenerationOptions;
}

export function usePDFDownload(hookOptions?: UsePDFDownloadOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useAppToast();

  const generatePDF = async <T = unknown>(params: GeneratePDFParams<T>) => {
    setIsGenerating(true);
    try {
      await pdfService.generatePDF({
        template: params.template,
        data: params.data,
        options: params.options,
      });

      hookOptions?.onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF';
      toast.error(errorMessage);

      if (error instanceof Error) {
        hookOptions?.onError?.(error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const previewPDF = async <T = unknown>(params: GeneratePDFParams<T>) => {
    setIsGenerating(true);
    try {
      await pdfService.previewPDF({
        template: params.template,
        data: params.data,
        options: params.options,
      });

      hookOptions?.onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PDF';
      toast.error(errorMessage);

      if (error instanceof Error) {
        hookOptions?.onError?.(error);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    previewPDF,
    isGenerating,
  };
}
