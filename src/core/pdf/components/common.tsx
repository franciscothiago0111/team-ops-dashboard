/**
 * PDF Common Components
 * Reusable components for PDF documents
 */

import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { commonStyles } from '../styles/common.styles';

interface FieldProps {
  label: string;
  value: string | number | null | undefined;
  minPresenceAhead?: number;
}

export const Field: React.FC<FieldProps> = ({ label, value, minPresenceAhead = 30 }) => (
  <View style={commonStyles.field} wrap={false} minPresenceAhead={minPresenceAhead}>
    <Text style={commonStyles.fieldLabel}>{label}</Text>
    <Text style={commonStyles.fieldValue}>{value || 'N/A'}</Text>
  </View>
);

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary' }) => {
  const badgeStyle = {
    primary: commonStyles.badgePrimary,
    success: commonStyles.badgeSuccess,
    warning: commonStyles.badgeWarning,
    danger: commonStyles.badgeDanger,
    secondary: commonStyles.badgeSecondary,
  }[variant];

  return (
    <View style={[commonStyles.badge, badgeStyle]}>
      <Text>{text}</Text>
    </View>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  wrap?: boolean;
  minPresenceAhead?: number;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  wrap = true,
  minPresenceAhead = 80
}) => (
  <View wrap={wrap} style={commonStyles.section} minPresenceAhead={minPresenceAhead}>
    <Text style={commonStyles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <View style={commonStyles.header}>
    <Text style={commonStyles.headerTitle}>{title}</Text>
    {subtitle && <Text style={commonStyles.headerSubtitle}>{subtitle}</Text>}
  </View>
);

interface FooterProps {
  leftText?: string;
  rightText?: string;
}

export const Footer: React.FC<FooterProps> = ({ leftText, rightText }) => (
  <View style={commonStyles.footer} fixed>
    <Text>{leftText}</Text>
    <Text
      render={({ pageNumber, totalPages }) =>
        rightText ? `${rightText} | Page ${pageNumber} of ${totalPages}` : `Page ${pageNumber} of ${totalPages}`
      }
    />
  </View>
);
