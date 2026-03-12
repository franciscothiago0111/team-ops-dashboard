/**
 * PDF Generation Types
 */

export interface IPDFGenerationOptions {
  filename?: string;
  author?: string;
  title?: string;
  subject?: string;
}

export interface IPDFTemplate<T = Record<string, unknown>> {
  name: string;
  generate: (data: T, options?: IPDFGenerationOptions) => Promise<Buffer>;
}

export interface IPDFTemplateRegistry {
  [key: string]: IPDFTemplate;
}

export interface IPDFGenerationRequest<T = Record<string, unknown>> {
  template: string;
  data: T;
  options?: IPDFGenerationOptions;
}

export interface IPDFGenerationResponse {
  success: boolean;
  filename?: string;
  error?: string;
}
