import { KpiCard } from '#/components/custom/kpi-card'
import { RecentToolsTable } from '#/components/custom/recent-tools-table'
import { useKpiData } from '#/hooks/useKpiData'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const { kpis, isLoading, isError } = useKpiData()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {isLoading ? (
        <div className="text-center text-slate-600">Loading KPI data...</div>
      ) : isError ? (
        <div className="text-center text-rose-600">Failed to load KPI data</div>
      ) : (
        <>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} {...kpi} />
            ))}
          </section>

          <section className="mt-6">
            <RecentToolsTable />
          </section>
        </>
      )}
    </main>
  )
}
