/**
 * PDF Generation Types
 */

export interface PDFGenerationOptions {
  filename?: string;
  author?: string;
  title?: string;
  subject?: string;
}

export interface PDFTemplate<T = any> {
  name: string;
  generate: (data: T, options?: PDFGenerationOptions) => Promise<Buffer>;
}

export interface PDFTemplateRegistry {
  [key: string]: PDFTemplate;
}

export interface PDFGenerationRequest<T = any> {
  template: string;
  data: T;
  options?: PDFGenerationOptions;
}

export interface PDFGenerationResponse {
  success: boolean;
  filename?: string;
  error?: string;
}
