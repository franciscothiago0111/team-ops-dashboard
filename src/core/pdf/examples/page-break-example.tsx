/**
 * Advanced Page Break Example Template
 * Demonstrates proper page break handling with @react-pdf/renderer
 */

import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { commonStyles } from '../styles/common.styles';
import {
  PageBreak,
  NoBreak,
  KeepTogether,
  ContentBlock,
  BreakableSection,
  FixedSection
} from '../utils/page-breaks';

interface ExampleData {
  title: string;
  sections: Array<{
    title: string;
    content: string[];
  }>;
}

/**
 * Example PDF with Page Break Handling
 */
export const PageBreakExamplePDF: React.FC<{ data: ExampleData }> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={commonStyles.page}>
        {/* Header that should never break */}
        <NoBreak>
          <View style={commonStyles.header}>
            <Text style={commonStyles.headerTitle}>{data.title}</Text>
            <Text style={commonStyles.headerSubtitle}>
              Example of Page Break Handling
            </Text>
          </View>
        </NoBreak>

        {/* Fixed section - all content on same page */}
        <FixedSection>
          <Text style={commonStyles.sectionTitle}>Important Notice</Text>
          <Text style={commonStyles.fieldValue}>
            This entire section will stay together on the same page.
            If there&apos;s not enough space, it will move to the next page entirely.
          </Text>
        </FixedSection>

        {/* Sections that can break naturally */}
        {data.sections.map((section, index) => (
          <BreakableSection key={index} title={section.title}>
            {section.content.map((paragraph, pIndex) => (
              <Text key={pIndex} style={[commonStyles.fieldValue, commonStyles.mb10]}>
                {paragraph}
              </Text>
            ))}
          </BreakableSection>
        ))}

        {/* Force page break */}
        <PageBreak />

        {/* Content on new page */}
        <View>
          <Text style={commonStyles.headerTitle}>New Page Content</Text>
          <Text style={commonStyles.fieldValue}>
            This content appears after a forced page break.
          </Text>
        </View>

        {/* Keep multiple items together */}
        <KeepTogether>
          <View style={commonStyles.section}>
            <Text style={commonStyles.sectionTitle}>Related Items</Text>
            <Text style={commonStyles.fieldValue}>Item 1: Description</Text>
            <Text style={commonStyles.fieldValue}>Item 2: Description</Text>
            <Text style={commonStyles.fieldValue}>Item 3: Description</Text>
          </View>
        </KeepTogether>

        {/* Content block with wrap control */}
        <ContentBlock wrap={true} minPresenceAhead={100}>
          <Text style={commonStyles.sectionTitle}>Flexible Section</Text>
          <Text style={commonStyles.fieldValue}>
            This section can break across pages if needed, but ensures
            at least 100 points of space ahead before breaking.
          </Text>
        </ContentBlock>
      </Page>
    </Document>
  );
};
