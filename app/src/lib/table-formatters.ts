import type { ToolStatus } from '#/api/model'

export function getStatusClass(status: ToolStatus) {
  if (status === 'active') return 'bg-emerald-500 text-white'
  if (status === 'expiring') return 'bg-orange-500 text-white'
  return 'bg-rose-500 text-white'
}

export function getStatusLabel(status: ToolStatus) {
  if (status === 'active') return 'Active'
  if (status === 'expiring') return 'Expiring'
  return 'Unused'
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function getToolIcon(category?: string) {
  const key = (category ?? '').toLowerCase()
  if (key.includes('communication')) return '🟣'
  if (key.includes('design')) return '🎨'
  if (key.includes('development') || key.includes('engineering')) return '⚡'
  if (key.includes('operations')) return '📝'
  if (key.includes('marketing')) return '🧢'
  if (key.includes('sales')) return '💼'
  return '🛠️'
}
