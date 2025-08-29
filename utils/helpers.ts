/**
 * Gera um ID único baseado em timestamp e um valor aleatório
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Formata um número como moeda brasileira (BRL)
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata uma data no padrão brasileiro (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

/**
 * Calcula o total de todos os itens em uma lista
 */
export function calculateTotal(items: any[]): number {
  return items.reduce((acc, item) => {
    const itemPrice = item.price || 0;
    const quantity = item.quantity || 1;
    return acc + (itemPrice * quantity);
  }, 0);
}

/**
 * Agrupa itens por categoria
 */
export function groupByCategory(items: any[]): Record<string, any[]> {
  return items.reduce((acc, item) => {
    const category = item.type || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
}
