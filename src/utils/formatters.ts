export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(rate: number | undefined | null, decimals = 1): string {
  if (rate === undefined || rate === null || isNaN(rate)) {
    return '0.0%';
  }
  return `${(rate * 100).toFixed(decimals)}%`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—';
  try {
    // If format is YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(year, month, day));
    }
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatNumber(num: number | undefined | null, decimals = 0): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
