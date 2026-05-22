import { getTools } from '#/api/default/default'
import type { Tool, ToolStatus } from '#/api/model'
import { getToolIcon } from '#/lib/table-formatters'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export type RecentToolRow = {
  id: number
  icon: string
  name: string
  department: string
  users: number
  monthlyCost: number
  status: ToolStatus
}

type SortKey = 'name' | 'users' | 'monthlyCost'
type SortDirection = 'asc' | 'desc'

const PAGE_SIZE = 10

function mapToolToRow(tool: Tool): RecentToolRow {
  return {
    id: tool.id,
    icon: getToolIcon(tool.category),
    name: tool.name,
    department: tool.owner_department ?? 'Unknown',
    users: tool.active_users_count ?? 0,
    monthlyCost: tool.monthly_cost ?? 0,
    status: tool.status,
  }
}

export function useRecentTools() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)

  const {
    data: tools = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['recent-tools'],
    queryFn: async () => {
      const res = await getTools({
        _sort: 'updated_at',
        _order: 'desc',
        _limit: 10,
      })
      return res.data.map(mapToolToRow)
    },
  })

  const sortedData = useMemo(() => {
    const data = [...tools]

    data.sort((a, b) => {
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortKey === 'users') {
        return a.users - b.users
      }
      return a.monthlyCost - b.monthlyCost
    })

    if (sortDirection === 'desc') data.reverse()
    return data
  }, [sortDirection, sortKey, tools])

  const pageCount = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return sortedData.slice(start, start + PAGE_SIZE)
  }, [safePage, sortedData])

  const startCount =
    sortedData.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const endCount = Math.min(safePage * PAGE_SIZE, sortedData.length)

  function onSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDirection('asc')
  }

  return {
    tools: pagedData,
    totalTools: sortedData.length,
    isLoading,
    isError,
    sortKey,
    sortDirection,
    onSort,
    page: safePage,
    pageCount,
    onPageChange: setPage,
    startCount,
    endCount,
  }
}
