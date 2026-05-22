import { useRecentTools } from '#/hooks/useRecentTools'
import {
  formatEuro,
  getStatusClass,
  getStatusLabel,
} from '#/lib/table-formatters'
import { CalendarDays, ChevronDown, ChevronUp, Ellipsis } from 'lucide-react'

export function RecentToolsTable() {
  const {
    tools,
    isLoading,
    isError,
    sortKey,
    sortDirection,
    onSort,
    page,
    pageCount,
    onPageChange,
    startCount,
    endCount,
    totalTools,
  } = useRecentTools()

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-800">
          Recent Tools
        </h2>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <CalendarDays className="h-4 w-4" />
          Last 30 days
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-600">
          Loading recent tools...
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-10 text-center text-rose-700">
          Failed to load tools from API.
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="overflow-x-auto" data-testid="recent-tools-table">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-600">
                <th className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => onSort('name')}
                    className="inline-flex items-center gap-1 text-left"
                  >
                    Tool
                    {sortKey === 'name' && sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : null}
                    {sortKey === 'name' && sortDirection === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null}
                  </button>
                </th>
                <th className="py-3 pr-4">Department</th>
                <th className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => onSort('users')}
                    className="inline-flex items-center gap-1 text-left"
                  >
                    Users
                    {sortKey === 'users' && sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : null}
                    {sortKey === 'users' && sortDirection === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null}
                  </button>
                </th>
                <th className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => onSort('monthlyCost')}
                    className="inline-flex items-center gap-1 text-left"
                  >
                    Monthly Cost
                    {sortKey === 'monthlyCost' && sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : null}
                    {sortKey === 'monthlyCost' && sortDirection === 'desc' ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : null}
                  </button>
                </th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tools.map((tool) => (
                <tr
                  key={tool.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className="py-4 pr-4 text-slate-800">
                    <span className="mr-3 text-base">{tool.icon}</span>
                    <span className="font-medium">{tool.name}</span>
                  </td>
                  <td className="py-4 pr-4 text-slate-600">
                    {tool.department}
                  </td>
                  <td className="py-4 pr-4 text-slate-700">{tool.users}</td>
                  <td className="py-4 pr-4 text-slate-700">
                    {formatEuro(tool.monthlyCost)}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                        tool.status,
                      )}`}
                    >
                      {getStatusLabel(tool.status)}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <details className="group relative inline-block">
                      <summary className="inline-flex cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100">
                        <Ellipsis className="h-4 w-4" />
                      </summary>

                      <div className="absolute right-0 z-20 mt-2 w-28 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                        {['View', 'Edit', 'Delete'].map((action) => (
                          <button
                            key={action}
                            type="button"
                            className="block w-full rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </details>
                  </td>
                </tr>
              ))}

              {tools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No recent tools found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>
            Showing {startCount}-{endCount} of {totalTools}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-md border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() =>
                onPageChange((prev) => Math.min(pageCount, prev + 1))
              }
              disabled={page === pageCount}
              className="rounded-md border border-slate-200 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
