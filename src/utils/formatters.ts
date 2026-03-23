const hufFormatter = new Intl.NumberFormat('hu-HU', {
  style: 'currency',
  currency: 'HUF',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const hufCompactFormatter = new Intl.NumberFormat('hu-HU', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatHUF(value: number): string {
  return hufFormatter.format(value);
}

export function formatHUFCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M Ft`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}e Ft`;
  }
  return `${hufCompactFormatter.format(value)} Ft`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function formatPercentDisplay(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function parseHUFInput(value: string): number {
  const cleaned = value.replace(/[^\d]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatHUFInput(value: number): string {
  if (value === 0) return '';
  return hufCompactFormatter.format(value);
}
