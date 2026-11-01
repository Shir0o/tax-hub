export function downloadJsonFile(filename: string, data: unknown): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function convertArrayToCsv<T extends Record<string, unknown>>(items: T[], headers: { key: keyof T; label: string }[]): string {
  if (items.length === 0) return '';
  const headerLine = headers.map(h => `"${h.label.replace(/"/g, '""')}"`).join(',');
  const rowLines = items.map(item => {
    return headers.map(h => {
      const val = item[h.key];
      const stringVal = val === null || val === undefined ? '' : String(val);
      return `"${stringVal.replace(/"/g, '""')}"`;
    }).join(',');
  });
  return [headerLine, ...rowLines].join('\n');
}
