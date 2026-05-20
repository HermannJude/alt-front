import type { Tool } from '#/api/model'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { getTools, getToolsId } from '../../api/default/default'
import {
  getDefaultMock,
  getGetToolsIdMockHandler,
  getGetToolsIdResponseMock,
  getGetToolsMockHandler,
  getGetToolsResponseMock,
} from '../../api/default/default.msw'

const server = setupServer(...getDefaultMock())

const makeToolsFixture = (): Tool[] => {
  const source = getGetToolsResponseMock()
  const fallback = source[0] ?? getGetToolsResponseMock()[0]
  const pick = (index: number, override: Partial<Tool>): Tool => ({
    ...(source[index] ?? fallback),
    ...override,
  })

  return [
    pick(0, {
      id: 6,
      name: 'Tool 6',
      status: 'active',
      monthly_cost: 60,
      updated_at: '2024-02-01',
      owner_department: 'Department 1',
    }),
    pick(1, {
      id: 1,
      name: 'Tool 1',
      status: 'active',
      monthly_cost: 10,
      updated_at: '2024-03-01',
      owner_department: 'Department 1',
    }),
    pick(2, {
      id: 3,
      name: 'Tool 3',
      status: 'unused',
      monthly_cost: 30,
      updated_at: '2024-04-01',
      owner_department: 'Department 2',
    }),
    pick(3, {
      id: 2,
      name: 'Tool 2',
      status: 'active',
      monthly_cost: 20,
      updated_at: '2024-05-01',
      owner_department: 'Department 2',
    }),
    pick(4, {
      id: 4,
      name: 'Tool 4',
      status: 'expiring',
      monthly_cost: 40,
      updated_at: '2024-06-01',
      owner_department: 'Department 1',
    }),
    pick(5, {
      id: 5,
      name: 'Tool 5',
      status: 'active',
      monthly_cost: 50,
      updated_at: '2024-07-01',
      owner_department: 'Department 2',
    }),
  ]
}

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
    const tools = makeToolsFixture()

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

  test.each(['monthly_cost', 'name', 'updated_at'] as const)(
    'should return a list of tools sorted by specific field %s',
    async (field) => {
      const tools = makeToolsFixture()

      server.use(
        getGetToolsMockHandler((info) => {
          const url = new URL(info.request.url)
          const sort = url.searchParams.get('_sort')
          const order = (url.searchParams.get('_order') ?? 'asc').toLowerCase()

          let data = [...tools]
          if (sort) {
            data.sort((a, b) => {
              const aVal = a[sort as keyof Tool]
              const bVal = b[sort as keyof Tool]

              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return aVal - bVal
              }

              const A = String(aVal ?? '')
              const B = String(bVal ?? '')
              return A.localeCompare(B, undefined, { sensitivity: 'base' })
            })
            if (order === 'desc') data.reverse()
          }
          return data
        }),
      )

      if (field === 'name') {
        const res = await getTools({ _sort: 'name', _order: 'asc' })
        expect(res.status).toBe(200)
        expect(res.data.map((t) => t.name)).toEqual(
          [...tools]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((t) => t.name),
        )
      } else if (field === 'monthly_cost') {
        const res = await getTools({ _sort: 'monthly_cost', _order: 'asc' })
        expect(res.status).toBe(200)
        expect(res.data.map((t) => t.monthly_cost)).toEqual(
          [...tools]
            .sort((a, b) => a.monthly_cost - b.monthly_cost)
            .map((t) => t.monthly_cost),
        )
      } else if (field === 'updated_at') {
        const res = await getTools({ _sort: 'updated_at', _order: 'asc' })
        expect(res.status).toBe(200)
        expect(res.data.map((t) => t.updated_at)).toEqual(
          [...tools]
            .sort((a, b) => a.updated_at.localeCompare(b.updated_at))
            .map((t) => t.updated_at),
        )
      }
    },
  )

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
      const tools = makeToolsFixture()
        .slice(0, 3)
        .map((tool, index) => ({
          ...tool,
          status: index === 0 ? 'active' : index === 1 ? 'unused' : 'expiring',
        }))

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

  //   test('should return a list of tools with embedded user_tools', async () => {
  //     const tools = makeToolsFixture()
  //       .slice(0, 2)
  //       .map((tool, index) => ({
  //         ...tool,
  //         id: index + 1,
  //         name: `Tool ${index + 1}`,
  //       }))

  //     const userTools: UserTool[] = getGetUserToolsResponseMock()
  //       .slice(0, 2)
  //       .map((relation, index) => ({
  //         ...relation,
  //         user_id: index + 1,
  //         tool_id: index + 1,
  //         usage_frequency: index === 0 ? 'daily' : 'weekly',
  //         proficiency_level: index === 0 ? 'advanced' : 'intermediate',
  //         last_used: index === 0 ? '2024-01-01' : '2024-01-02',
  //       }))

  //     server.use(
  //       getGetToolsMockHandler((info) => {
  //         const url = new URL(info.request.url)
  //         const embed = url.searchParams.get('_embed')

  //         if (embed === 'user_tools') {
  //           return tools.map(
  //             (tool): ToolWithUserTools => ({
  //               ...tool,
  //               user_tools: userTools.filter(
  //                 (relation) => relation.tool_id === tool.id,
  //               ),
  //             }),
  //           )
  //         }

  //         return tools
  //       }),
  //     )

  //     const res = await getTools({ _embed: 'user_tools' })
  //     expect(res.status).toBe(200)
  //     expect(Array.isArray(res.data)).toBe(true)
  //     expect(res.data).toHaveLength(2)
  //     expect(res.data[0]).toHaveProperty('user_tools')
  //     expect(Array.isArray(res.data[0].user_tools)).toBe(true)
  //     expect(res.data[0].user_tools).toHaveLength(1)
  //     expect(res.data[0].user_tools[0].tool_id).toBe(1)
  //     expect(res.data[0].user_tools[0].user_id).toBe(1)
  //     expect(res.data[1]).toHaveProperty('user_tools')
  //     expect(Array.isArray(res.data[1].user_tools)).toBe(true)
  //     expect(res.data[1].user_tools).toHaveLength(1)
  //     expect(res.data[1].user_tools[0].tool_id).toBe(2)
  //     expect(res.data[1].user_tools[0].user_id).toBe(2)
  //   })
})

describe('getToolsId', () => {
  test('should return a tool with a specific ID', async () => {
    server.use(
      getGetToolsIdMockHandler(
        getGetToolsIdResponseMock({ id: 1, name: 'Tool 1', status: 'active' }),
      ),
    )
    const res = await getToolsId(1)
    expect(res.status).toBe(200)
    expect(res.data).toHaveProperty('id', 1)
    expect(res.data).toHaveProperty('name', 'Tool 1')
    expect(res.data).toHaveProperty('status', 'active')
  })
})
