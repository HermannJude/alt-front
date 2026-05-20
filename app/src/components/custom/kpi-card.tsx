import { cn } from '#/lib/utils.ts'
import type { LucideIcon } from 'lucide-react'

type TrendTone = 'emerald' | 'violet' | 'orange' | 'pink'

export type KpiCardProps = {
  label: string
  value: string
  subValue?: string
  trend: string
  icon: LucideIcon
  tone: TrendTone
  className?: string
}

const toneStyles: Record<TrendTone, { iconWrap: string; trendPill: string }> = {
  emerald: {
    iconWrap: 'bg-emerald-500 text-white',
    trendPill: 'bg-emerald-500 text-white',
  },
  violet: {
    iconWrap: 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white',
    trendPill: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white',
  },
  orange: {
    iconWrap: 'bg-gradient-to-br from-orange-500 to-pink-500 text-white',
    trendPill: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
  },
  pink: {
    iconWrap: 'bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white',
    trendPill: 'bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white',
  },
}

export function KpiCard({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  tone,
  className,
}: KpiCardProps) {
  const styles = toneStyles[tone]

  return (
    <article
      className={cn(
        'rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm',
        className,
      )}
    >
      <div className="mb-8 flex items-start justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span
          className={cn(
            'grid h-8 w-8 place-items-center rounded-xl',
            styles.iconWrap,
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <div className="space-y-3">
        <p
          className="text-xl leading-none font-extrabold tracking-tight text-slate-900"
          data-testid="kpi-card-values"
        >
          {value}
          {subValue ? (
            <span className="font-bold text-slate-400">{subValue}</span>
          ) : null}
        </p>

        <span
          className={cn(
            'inline-flex rounded-full px-3 py-1 text-sm font-semibold',
            styles.trendPill,
          )}
        >
          {trend}
        </span>
      </div>
    </article>
  )
}
