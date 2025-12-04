# Page Break Handling in @react-pdf/renderer

## Overview

This document explains how to properly handle page breaks and pagination in your PDF templates using `@react-pdf/renderer`.

## Core Concepts

### 1. **wrap** Property
Controls whether content can break across pages:
- `wrap={true}` (default): Content can break naturally
- `wrap={false}`: Content stays together on one page

### 2. **break** Property
Forces or prevents page breaks:
- `break="before"`: Force break before element
- `break="after"`: Force break after element
- `break="avoid"`: Prevent breaking inside element

### 3. **minPresenceAhead** Property
Minimum space (in points) required ahead before allowing a break:
- Useful for preventing orphaned content
- Example: `minPresenceAhead={100}` ensures 100pt space or moves to next page

## Available Components

### Basic Components

```tsx
import { 
  PageBreak,      // Force page break
  NoBreak,        // Prevent breaking
  KeepTogether,   // Keep content on same page
  PageSection,    // Section with break control
  ContentBlock,   // Generic block with options
  BreakableSection, // Allows natural breaking
  FixedSection,   // Must stay on one page
  OrphanControl,  // Prevent orphaned content
  TableRow        // Non-breaking table row
} from '@/core/pdf/utils/page-breaks';
```

### Usage Examples

#### 1. Force Page Break
```tsx
<PageBreak />
```

#### 2. Keep Content Together
```tsx
<KeepTogether>
  <Section title="Important Info">
    <Field label="Name" value="John Doe" />
    <Field label="Email" value="john@example.com" />
  </Section>
</KeepTogether>
```

#### 3. Prevent Header Breaking
```tsx
<NoBreak>
  <Header title="Document Title" subtitle="Subtitle" />
</NoBreak>
```

#### 4. Allow Natural Breaking
```tsx
<BreakableSection title="Long Content">
  {longContent.map(item => (
    <Text key={item.id}>{item.text}</Text>
  ))}
</BreakableSection>
```

#### 5. Fixed Section (All or Nothing)
```tsx
<FixedSection>
  <Text>This entire section</Text>
  <Text>will stay together</Text>
  <Text>on one page</Text>
</FixedSection>
```

#### 6. Content Block with Min Space
```tsx
<ContentBlock wrap={true} minPresenceAhead={150}>
  <Text>Needs 150pt space ahead</Text>
</ContentBlock>
```

## Best Practices

### ✅ DO

1. **Wrap Headers and Titles**
```tsx
<NoBreak>
  <Text style={styles.sectionTitle}>Section Title</Text>
</NoBreak>
```

2. **Keep Related Fields Together**
```tsx
<KeepTogether>
  <Field label="First Name" value={user.firstName} />
  <Field label="Last Name" value={user.lastName} />
</KeepTogether>
```

3. **Use FixedSection for Critical Info**
```tsx
<FixedSection>
  <Text>Critical information that must stay together</Text>
</FixedSection>
```

4. **Allow Long Content to Break**
```tsx
<View wrap={true}>
  <Text>{longDescription}</Text>
</View>
```

### ❌ DON'T

1. **Don't wrap everything in KeepTogether**
   - Can cause overflow and rendering issues
   - Only use for truly related content

2. **Don't use wrap={false} on large sections**
   - May not fit on one page
   - Can cause content to disappear

3. **Don't forget about dynamic content**
   - Test with varying content lengths
   - Account for optional fields

## Common Patterns

### Pattern 1: Document with Multiple Sections
```tsx
<Page>
  <NoBreak>
    <Header title="Report" />
  </NoBreak>

  <KeepTogether>
    <Section title="Summary">
      {/* Summary content */}
    </Section>
  </KeepTogether>

  <BreakableSection title="Details">
    {/* Long content that can break */}
  </BreakableSection>

  <Footer />
</Page>
```

### Pattern 2: Table with Non-Breaking Rows
```tsx
<View style={styles.table}>
  <View wrap={false} style={styles.tableHeader}>
    <Text>Column 1</Text>
    <Text>Column 2</Text>
  </View>
  
  {data.map(row => (
    <TableRow key={row.id}>
      <Text>{row.col1}</Text>
      <Text>{row.col2}</Text>
    </TableRow>
  ))}
</View>
```

### Pattern 3: Multi-Page Document
```tsx
<Document>
  <Page>
    {/* Page 1 content */}
  </Page>
  
  <PageBreak />
  
  <Page>
    {/* Page 2 content */}
  </Page>
</Document>
```

## Debugging Tips

1. **Test with varying content lengths**
   - Short content
   - Medium content
   - Very long content

2. **Check page boundaries**
   - Use colored borders temporarily
   - Verify spacing is correct

3. **Monitor console warnings**
   - @react-pdf/renderer warns about overflow
   - Address warnings to prevent issues

4. **Preview in browser**
   - Use `previewPDF()` for testing
   - Easier than downloading repeatedly

## Updated Common Styles

The following styles have been added for page break control:

```typescript
// Break control
breakBefore: { break: 'before' }
breakAfter: { break: 'after' }
breakAvoid: { break: 'avoid' }
breakInside: { break: 'inside' }

// Wrapping
wrapContent: { break: 'avoid' }
keepTogether: { break: 'avoid' }
sectionWrap: { marginBottom: 20, break: 'avoid' }
```

## Example Implementation

See `src/core/pdf/templates/task-details.template.tsx` for a working example of proper page break handling.

Key features:
- Header wrapped in `NoBreak`
- Sections wrapped in `KeepTogether`
- Long descriptions allow natural breaking
- Footer fixed at bottom

## Resources

- [@react-pdf/renderer Documentation](https://react-pdf.org/)
- [Page Break Props](https://react-pdf.org/advanced#page-breaks)
- [Layout Props](https://react-pdf.org/layout)
