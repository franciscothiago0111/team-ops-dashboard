/**
 * PDF Service
 * Client-side service for PDF generation
 */

import { api } from '@/core/api/http';
import { PDFGenerationOptions } from '@/core/pdf/types';

export interface GeneratePDFParams<T = unknown> {
  template: string;
  data: T;
  options?: PDFGenerationOptions;
}

export interface AvailableTemplatesResponse {
  success: boolean;
  templates: string[];
  count: number;
}

class PDFService {
  private readonly baseUrl = '/api/pdf';

  /**
   * Generate and download a PDF
   */
  async generatePDF<T = unknown>(params: GeneratePDFParams<T>): Promise<void> {
    try {
      // Make request with fetch directly for blob response
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = params.options?.filename || `${params.template}-${Date.now()}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  /**
   * Get list of available PDF templates
   */
  async getAvailableTemplates(): Promise<string[]> {
    try {
      const response = await api.get<AvailableTemplatesResponse>(
        `${this.baseUrl}/generate`
      );
      return response.templates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      return [];
    }
  }

  /**
   * Generate PDF in new tab (for preview)
   */
  async previewPDF<T = unknown>(params: GeneratePDFParams<T>): Promise<void> {
    try {
      // Make request with fetch directly for blob response
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get blob and open in new tab
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Cleanup after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('PDF preview failed:', error);
      throw new Error('Failed to preview PDF. Please try again.');
    }
  }
}

export const pdfService = new PDFService();
