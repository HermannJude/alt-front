import { getAnalytics } from '#/api/default/default'
import type { KpiCardProps } from '#/components/custom/kpi-card'
import { useQuery } from '@tanstack/react-query'
import { Building2, Euro, TrendingUp, Wrench } from 'lucide-react'

export function useKpiData() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await getAnalytics()
      return res.data
    },
  })

  if (!data) {
    return { kpis: [], isLoading, isError }
  }

  const budgetOverview = data?.budget_overview as Record<string, any>
  const kpiTrends = data?.kpi_trends as Record<string, any>
  const costAnalytics = data?.cost_analytics as Record<string, any>

  // Transform analytics data into KPI card props using actual API structure
  const kpis: KpiCardProps[] = [
    {
      label: 'Monthly Budget',
      value: `€${(budgetOverview?.current_month_total).toLocaleString()}`,
      subValue: `/€${(budgetOverview?.monthly_limit).toLocaleString()}`,
      trend: `${budgetOverview?.trend_percentage}%`,
      icon: TrendingUp,
      tone: 'emerald',
    },
    {
      label: 'Active Tools',
      value: String(costAnalytics?.active_users),
      trend: kpiTrends?.tools_change,
      icon: Wrench,
      tone: 'violet',
    },
    {
      label: 'Departments',
      value: String(costAnalytics?.total_users),
      trend: kpiTrends?.departments_change,
      icon: Building2,
      tone: 'orange',
    },
    {
      label: 'Cost/User',
      value: `€${costAnalytics?.cost_per_user}`,
      trend: kpiTrends?.cost_per_user_change,
      icon: Euro,
      tone: 'pink',
    },
  ]

  return { kpis, isLoading, isError }
}
