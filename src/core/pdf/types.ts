/**
 * PDF Generation Types
 */

export interface IPDFGenerationOptions {
  filename?: string;
  author?: string;
  title?: string;
  subject?: string;
}

export interface IPDFTemplate<T = any> {
  name: string;
  generate: (data: T, options?: PDFGenerationOptions) => Promise<Buffer>;
}

export interface IPDFTemplateRegistry {
  [key: string]: PDFTemplate;
}

export interface IPDFGenerationRequest<T = any> {
  template: string;
  data: T;
  options?: PDFGenerationOptions;
}

export interface IPDFGenerationResponse {
  success: boolean;
  filename?: string;
  error?: string;
}
