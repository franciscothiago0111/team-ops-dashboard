export function formeteCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos do CNPJ
  const numericCNPJ = cnpj.replace(/\D/g, '');

  // Aplica a formatação específica do CNPJ
  return numericCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}

export function formateCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos do CPF
  const numericCPF = cpf.replace(/\D/g, '');

  // Aplica a formatação específica do CPF
  return numericCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

export function formatDate(date: Date | string) {
  console.log('formatDate', date);

  if (!date || Number.isNaN(new Date(date).getTime())) {
    return ''; // Retorna string vazia para datas inválidas
  }

  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC', // ← Evita "adiantamento" por fuso
  });
}
export function formatDateShort(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDate2Digit(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
}

export function formatDateToHour(date: Date | string) {
  const newDate = new Date(date);

  newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());

  return `${newDate.getHours()} : ${newDate.getMinutes()}`;
}


