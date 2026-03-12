/**
 * PDF Template Registry
 * Central registry for all PDF templates
 */

import type { IPDFTemplate, IPDFTemplateRegistry } from './types';

class PDFRegistry {
  private templates: IPDFTemplateRegistry = {};

  /**
   * Register a new PDF template
   */
  register<T = unknown>(template: IPDFTemplate<T>): void {
    if (this.templates[template.name]) {
      console.warn(`Template "${template.name}" is already registered. Overwriting...`);
    }
    this.templates[template.name] = template;
  }

  /**
   * Get a template by name
   */
  getTemplate<T = unknown>(name: string): IPDFTemplate<T> | undefined {
    return this.templates[name] as IPDFTemplate<T> | undefined;
  }

  /**
   * Get all registered template names
   */
  getTemplateNames(): string[] {
    return Object.keys(this.templates);
  }

  /**
   * Check if a template exists
   */
  hasTemplate(name: string): boolean {
    return name in this.templates;
  }

  /**
   * Unregister a template
   */
  unregister(name: string): boolean {
    if (this.hasTemplate(name)) {
      delete this.templates[name];
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const pdfRegistry = new PDFRegistry();
