/**
 * PDF Generation API Route
 * POST /api/pdf/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { pdfRegistry } from '@/core/pdf/registry';
import { PDFGenerationRequest } from '@/core/pdf/types';
// Import templates to ensure registration
import '@/core/pdf/templates';

export async function POST(request: NextRequest) {
  try {
    const body: PDFGenerationRequest = await request.json();
    const { template, data, options } = body;

    // Validate request
    if (!template || !data) {
      return NextResponse.json(
        { success: false, error: 'Template and data are required' },
        { status: 400 }
      );
    }

    // Get template from registry
    const pdfTemplate = pdfRegistry.getTemplate(template);

    if (!pdfTemplate) {
      return NextResponse.json(
        {
          success: false,
          error: `Template "${template}" not found`,
          availableTemplates: pdfRegistry.getTemplateNames(),
        },
        { status: 404 }
      );
    }

    // Generate PDF
    const pdfBuffer = await pdfTemplate.generate(data, options);

    // Set filename
    const filename = options?.filename || `${template}-${Date.now()}.pdf`;

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate PDF',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pdf/generate
 * List available templates
 */
export async function GET() {
  try {
    const templates = pdfRegistry.getTemplateNames();

    return NextResponse.json({
      success: true,
      templates,
      count: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
