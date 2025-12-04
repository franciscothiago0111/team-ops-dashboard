/**
 * PDF Templates Index
 * Auto-register all PDF templates
 */

import { pdfRegistry } from '../registry';
import { taskDetailsPDFTemplate } from './task-details.template';


// Register all templates
export function registerPDFTemplates() {
  pdfRegistry.register(taskDetailsPDFTemplate);

  // Add more templates here as they are created
  // pdfRegistry.register(employeeDetailsPDFTemplate);
  // pdfRegistry.register(teamReportPDFTemplate);
}

// Auto-register on import
registerPDFTemplates();

// Export templates
export { taskDetailsPDFTemplate };
