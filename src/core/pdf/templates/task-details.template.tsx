/**
 * Task Details PDF Template
 */

import React from 'react';
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer';
import { Task } from '@/shared/types/task';
import { commonStyles } from '../styles/common.styles';
import { Header, Section, Field, Badge, Footer } from '../components/common';
import { formatStatus, formatPriority } from '../utils/formatters';
import { htmlToPlainText } from '../utils/html-to-text';
import { PDFTemplate, PDFGenerationOptions } from '../types';
import { KeepTogether, NoBreak } from '../utils/page-breaks';
import { formatDate } from '@/core/utils/formatters';

interface TaskDetailsPDFProps {
  task: Task;
  options?: PDFGenerationOptions;
}

const TaskDetailsPDF: React.FC<TaskDetailsPDFProps> = ({ task, options }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'danger';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  return (
    <Document
      author={options?.author || 'Team Ops Dashboard'}
      title={options?.title || `Task: ${task.name}`}
      subject={options?.subject || 'Task Details'}
    >
      <Page size="A4" style={commonStyles.page} wrap>
        {/* Header - Fixed on first page */}
        <NoBreak>
          <Header
            title="Detalhes da Tarefa"
            subtitle={`Gerado em ${formatDate(new Date())}`}
          />
        </NoBreak>

        {/* Task Information */}
        <KeepTogether>
          <Section title="Informações da Tarefa" wrap={false} minPresenceAhead={120}>
            <Field label="ID da Tarefa" value={task.id} minPresenceAhead={35} />
            <Field label="Nome da Tarefa" value={task.name} minPresenceAhead={35} />

            <View style={commonStyles.field} wrap={false} minPresenceAhead={35}>
              <Text style={commonStyles.fieldLabel}>Status</Text>
              <Badge
                text={formatStatus(task.status)}
                variant={getStatusBadgeVariant(task.status)}
              />
            </View>

            <View style={commonStyles.field} wrap={false} minPresenceAhead={35}>
              <Text style={commonStyles.fieldLabel}>Priority</Text>
              <Badge
                text={formatPriority(task.priority)}
                variant={getPriorityBadgeVariant(task.priority)}
              />
            </View>

            <Field label="Data de Vencimento" value={formatDate(task.dueDate)} minPresenceAhead={35} />
          </Section>
        </KeepTogether>

        {/* Description - Can span multiple pages */}
        {task.description && (
          <View style={commonStyles.section} wrap minPresenceAhead={100}>
            <View wrap={false} minPresenceAhead={80}>
              <Text style={commonStyles.sectionTitle}>Descrição</Text>
            </View>
            <View wrap minPresenceAhead={50}>
              <Text style={commonStyles.fieldValue}>{htmlToPlainText(task.description)}</Text>
            </View>
          </View>
        )}

        {/* Assignment Details */}
        <KeepTogether>
          <Section title="Detalhes da Atribuição" wrap={false} minPresenceAhead={100}>
            <Field
              label="Atribuído a"
              value={task.assignedTo?.name || task.assignedToId}
              minPresenceAhead={35}
            />
            {task.assignedTo?.email && (
              <Field label="Email do Atribuído" value={task.assignedTo.email} minPresenceAhead={35} />
            )}
            {task.team?.name && <Field label="Equipe" value={task.team.name} minPresenceAhead={35} />}
          </Section>
        </KeepTogether>

        {/* Creation Details */}
        <KeepTogether>
          <Section title="Detalhes da Criação" wrap={false} minPresenceAhead={100}>
            <Field
              label="Criado Por"
              value={task.createdBy?.name || task.createdById}
              minPresenceAhead={35}
            />
            <Field label="Criado Em" value={formatDate(task.createdAt)} minPresenceAhead={35} />
            <Field label="Última Atualização" value={formatDate(task.updatedAt)} minPresenceAhead={35} />
          </Section>
        </KeepTogether>

        {/* Footer - Dynamic page numbers */}
        <Footer
          leftText="Gerado por Team Ops Dashboard"
          rightText=""
        />
      </Page>
    </Document>
  );
};

/**
 * Generate Task Details PDF
 */
const generateTaskDetailsPDF = async (
  data: Task,
  options?: PDFGenerationOptions
): Promise<Buffer> => {
  const document = <TaskDetailsPDF task={data} options={options} />;
  const asPdf = pdf(document);
  const blob = await asPdf.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

/**
 * Task Details PDF Template Export
 */
export const taskDetailsPDFTemplate: PDFTemplate<Task> = {
  name: 'task-details',
  generate: generateTaskDetailsPDF,
};
