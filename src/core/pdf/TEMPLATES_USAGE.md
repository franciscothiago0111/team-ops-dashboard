# Page Break Implementation Examples

## Available Templates

The PDF system now includes multiple templates demonstrating different page break scenarios:

### 1. **task-details** (Basic)
Simple single-page task details with basic page break protection.

### 2. **task-details-enhanced** (Advanced)
Enhanced version with comprehensive page break handling:
- `NoBreak`: Header never breaks
- `FixedSection`: Task info stays on one page
- `BreakableSection`: Long descriptions can break naturally
- `KeepTogether`: Related fields stay together
- `ContentBlock`: Smart breaking with minPresenceAhead

### 3. **multi-page-report** (Multi-Page)
Demonstrates handling documents that span multiple pages:
- Explicit page breaks between sections
- Headers on each page
- Page numbering
- Different sections on different pages

### 4. **table-report** (Tables)
Shows proper table pagination:
- Non-breaking table rows
- Fixed header that repeats on each page
- Table can break between rows
- Each row stays intact

## Using the Templates

### Download Enhanced Task PDF
```typescript
await pdfService.generatePDF({
  template: 'task-details-enhanced',
  data: taskData,
  options: {
    filename: 'task-enhanced.pdf',
  },
});
```

### Generate Multi-Page Report
```typescript
await pdfService.generatePDF({
  template: 'multi-page-report',
  data: {
    title: 'Monthly Report',
    summary: 'Executive summary...',
    sections: [
      {
        title: 'Section 1',
        items: [
          { label: 'Field 1', value: 'Value 1' },
          { label: 'Field 2', value: 'Value 2' },
        ],
      },
      // More sections...
    ],
    notes: ['Note 1', 'Note 2'],
  },
  options: {
    filename: 'report.pdf',
  },
});
```

### Generate Table Report
```typescript
await pdfService.generatePDF({
  template: 'table-report',
  data: {
    title: 'Task List',
    columns: ['ID', 'Name', 'Status', 'Date', 'Assignee'],
    rows: tasks.map(task => ({
      id: task.id,
      name: task.name,
      status: task.status,
      date: formatDate(task.dueDate),
      assignee: task.assignedTo?.name || 'Unassigned',
    })),
  },
  options: {
    filename: 'tasks-table.pdf',
  },
});
```

## Page Break Components Used

### NoBreak
Prevents content from breaking across pages:
```tsx
<NoBreak>
  <Header title="Title" />
</NoBreak>
```

### KeepTogether
Keeps content on same page (wrap={false}):
```tsx
<KeepTogether>
  <Section title="Info">
    <Field label="Name" value="John" />
    <Field label="Email" value="john@example.com" />
  </Section>
</KeepTogether>
```

### FixedSection
Entire section on one page with minPresenceAhead:
```tsx
<FixedSection minPresenceAhead={80}>
  <Section title="Summary">
    {/* Content */}
  </Section>
</FixedSection>
```

### BreakableSection
Allows natural breaking for long content:
```tsx
<BreakableSection title="Description">
  <Text>{longText}</Text>
</BreakableSection>
```

### ContentBlock
Generic block with break control:
```tsx
<ContentBlock wrap={true} minPresenceAhead={50}>
  <Text>{content}</Text>
</ContentBlock>
```

### OrphanControl
Prevents orphaned content:
```tsx
<OrphanControl>
  <Field label="Info" value="Value" />
</OrphanControl>
```

### TableRow
Non-breaking table row:
```tsx
<TableRow>
  <Text>Cell 1</Text>
  <Text>Cell 2</Text>
</TableRow>
```

## Key Features

✅ **Header Protection**: Headers never break across pages  
✅ **Section Integrity**: Related content stays together  
✅ **Smart Breaking**: Long content breaks naturally  
✅ **Table Pagination**: Tables break between rows, not within  
✅ **Orphan Prevention**: Prevents lonely content at page boundaries  
✅ **Multi-Page Support**: Explicit control over page breaks  
✅ **Flexible Layout**: Mix of fixed and breakable sections

## Testing

Test PDFs with:
- Short content (fits on one page)
- Medium content (needs smart breaking)
- Long content (spans multiple pages)
- Many table rows (tests pagination)
- Very long descriptions (tests text wrapping)

All templates are registered and available via the PDF service!
