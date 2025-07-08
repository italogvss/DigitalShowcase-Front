export function formatDate(dateString: string): string {
  // Converter para objeto Date
  const date = new Date(dateString);

  // Obter os componentes da data
  const day = String(date.getDate()).padStart(2, '0'); // Garantir 2 dígitos para o dia
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajuste para mês de 0-11
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Formatar a string
  return `${hours}:${minutes}:${seconds} - ${day}/${month} `;
}

export function getCurrentDate(){
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0'); // Garantir 2 dígitos para o dia
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajuste para mês de 0-11
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Formatar a string
  return `${hours}:${minutes}:${seconds} - ${day}/${month} `;
}

