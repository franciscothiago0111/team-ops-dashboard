/**
 * PDF Templates Index
 * Auto-register all PDF templates
 */

import { pdfRegistry } from '../registry';
import { taskDetailsPDFTemplate } from './task-details.template';
import { taskDetailsPDFTemplateEnhanced } from './task-details-enhanced.template';
import { multiPageReportTemplate } from './multi-page-report.template';
import { tableReportTemplate } from './table-report.template';

// Register all templates
export function registerPDFTemplates() {
  pdfRegistry.register(taskDetailsPDFTemplate);
  pdfRegistry.register(taskDetailsPDFTemplateEnhanced);
  pdfRegistry.register(multiPageReportTemplate);
  pdfRegistry.register(tableReportTemplate);

  // Add more templates here as they are created
  // pdfRegistry.register(employeeDetailsPDFTemplate);
  // pdfRegistry.register(teamReportPDFTemplate);
}

// Auto-register on import
registerPDFTemplates();

// Export templates
export { taskDetailsPDFTemplate };
export { taskDetailsPDFTemplateEnhanced };
export { multiPageReportTemplate };
export { tableReportTemplate };