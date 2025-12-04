/**
 * Page Break Utilities
 * Utilities for managing page breaks and pagination in PDFs
 */

import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { commonStyles } from '../styles/common.styles';

/**
 * PageBreak Component
 * Forces a page break at this location
 */
export const PageBreak: React.FC = () => <View break />;

/**
 * NoBreak Component
 * Prevents content inside from breaking across pages
 */
interface NoBreakProps {
  children: React.ReactNode;
}

export const NoBreak: React.FC<NoBreakProps> = ({ children }) => (
  <View style={commonStyles.breakAvoid}>{children}</View>
);

/**
 * KeepTogether Component
 * Keeps content together on the same page
 */
export const KeepTogether: React.FC<NoBreakProps> = ({ children }) => (
  <View wrap={false}>{children}</View>
);

/**
 * PageSection Component
 * Section that tries to stay together but can break if needed
 */
interface PageSectionProps {
  title?: string;
  children: React.ReactNode;
  wrap?: boolean;
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  wrap = true
}) => (
  <View wrap={wrap} style={commonStyles.section}>
    {title && <Text style={commonStyles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

/**
 * ContentBlock Component
 * Generic content block with break control
 */
interface ContentBlockProps {
  children: React.ReactNode;
  wrap?: boolean;
  minPresenceAhead?: number;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  children,
  wrap = true,
  minPresenceAhead = 0,
}) => (
  <View wrap={wrap} minPresenceAhead={minPresenceAhead}>
    {children}
  </View>
);

/**
 * TableRow Component
 * Row that prevents breaking in the middle
 */
interface TableRowProps {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children }) => (
  <View wrap={false} style={commonStyles.tableRow}>
    {children}
  </View>
);

/**
 * BreakableSection Component
 * Section that allows content to break naturally
 */
interface BreakableSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const BreakableSection: React.FC<BreakableSectionProps> = ({
  title,
  children
}) => (
  <View style={commonStyles.section}>
    {title && (
      <View wrap={false}>
        <Text style={commonStyles.sectionTitle}>{title}</Text>
      </View>
    )}
    <View wrap>{children}</View>
  </View>
);

/**
 * OrphanControl Component
 * Prevents content from breaking awkwardly
 */
interface OrphanControlProps {
  children: React.ReactNode;
}

export const OrphanControl: React.FC<OrphanControlProps> = ({
  children,
}) => (
  <View wrap={false} minPresenceAhead={50}>
    {children}
  </View>
);

/**
 * FixedSection Component
 * Section that must appear entirely on one page
 */
interface FixedSectionProps {
  children: React.ReactNode;
  minPresenceAhead?: number;
}

export const FixedSection: React.FC<FixedSectionProps> = ({
  children,
  minPresenceAhead = 100,
}) => (
  <View wrap={false} minPresenceAhead={minPresenceAhead}>
    {children}
  </View>
);
