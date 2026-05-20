import type { Tool } from '#/api/model'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { getTools, getToolsId } from '../../api/default/default'
import {
  getDefaultMock,
  getGetToolsIdMockHandler,
  getGetToolsMockHandler,
} from '../../api/default/default.msw'

const server = setupServer(...getDefaultMock([]))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('getTools', () => {
  test('should return a list of tools', async () => {
    const res = await getTools()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })
  test('should return a list of tools with pagination', async () => {
    const tools: Tool[] = [
      { id: 1, name: 'Tool 1', status: 'active' },
      { id: 2, name: 'Tool 2', status: 'active' },
      { id: 3, name: 'Tool 3', status: 'unused' },
      { id: 4, name: 'Tool 4', status: 'expiring' },
      { id: 5, name: 'Tool 5', status: 'active' },
      { id: 6, name: 'Tool 6', status: 'active' },
    ]

    server.use(
      getGetToolsMockHandler((info) => {
        const url = new URL(info.request.url)
        const page = Number(url.searchParams.get('_page') ?? '1')
        const limit = Number(url.searchParams.get('_limit') ?? '10')
        const start = (page - 1) * limit
        const end = start + limit

        return tools.slice(start, end)
      }),
    )

    const res = await getTools({ _page: 1, _limit: 5 })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data).toHaveLength(5)
  })
  test('should return a list of tools sorted by name', async () => {
    const tools: Tool[] = [
      { id: 1, name: 'Tool 1', status: 'active' },
      { id: 2, name: 'Tool 2', status: 'active' },
      { id: 3, name: 'Tool 3', status: 'unused' },
      { id: 4, name: 'Tool 4', status: 'expiring' },
      { id: 5, name: 'Tool 5', status: 'active' },
      { id: 6, name: 'Tool 6', status: 'active' },
    ]

    server.use(
      getGetToolsMockHandler((info) => {
        const url = new URL(info.request.url)
        const sort = url.searchParams.get('_sort')
        const order = (url.searchParams.get('_order') ?? 'asc').toLowerCase()

        let data = [...tools] // tools defined in test

        if (sort) {
          data.sort((a, b) => {
            const A = String((a as any)[sort] ?? '')
            const B = String((b as any)[sort] ?? '')
            return A.localeCompare(B, undefined, { sensitivity: 'base' })
          })
          if (order === 'desc') data.reverse()
        }

        return data
      }),
    )

    const res = await getTools({ _sort: 'name', _order: 'asc' })
    expect(res.status).toBe(200)
    expect(res.data.map((t) => t.name)).toEqual(
      [...tools]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((t) => t.name),
    )
  })
  test('should return an empty list of tools', async () => {
    server.use(getGetToolsMockHandler([]))
    const res = await getTools()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBe(0)
  })
  test.each(['active', 'unused', 'expiring'] as const)(
    'should return a list of tools with status %s',
    async (status) => {
      const tools: Tool[] = [
        { id: 1, name: 'Tool 1', status: 'active' },
        { id: 2, name: 'Tool 2', status: 'unused' },
        { id: 3, name: 'Tool 3', status: 'expiring' },
      ]

      server.use(
        getGetToolsMockHandler((info) => {
          const url = new URL(info.request.url)
          const statusParam = url.searchParams.get('status')
          return tools.filter((tool) => tool.status === statusParam)
        }),
      )

      const res = await getTools({ status })
      expect(res.status).toBe(200)
      expect(Array.isArray(res.data)).toBe(true)
      expect(res.data).toHaveLength(1)
      expect(res.data[0].status).toBe(status)
    },
  )
})

describe('getToolsId', () => {
  test('should return a tool with a specific ID', async () => {
    server.use(
      getGetToolsIdMockHandler({ id: 1, name: 'Tool 1', status: 'active' }),
    )
    const res = await getToolsId(1)
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('id', 1)
    expect(res.data).toHaveProperty('name', 'Tool 1')
    expect(res.data).toHaveProperty('status', 'active')
  })
})
