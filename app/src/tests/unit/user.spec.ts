import { getUsers, getUserTools } from '#/api/default/default'
import type { Department, UserTool } from '#/api/model'
import type { User } from '#/api/model/user'
import type { UserWithDepartment } from '#/types/api-extensions'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import {
  getDefaultMock,
  getGetDepartmentsResponseMock,
  getGetUsersMockHandler,
  getGetUsersResponseMock,
  getGetUserToolsMockHandler,
  getGetUserToolsResponseMock,
} from '../../api/default/default.msw'

const server = setupServer(...getDefaultMock())

const makeUsersFixture = (): User[] => {
  const source = getGetUsersResponseMock()
  const fallback = source[0] ?? getGetUsersResponseMock()[0]
  const pick = (index: number, override: Partial<User>): User => ({
    ...(source[index] ?? fallback),
    ...override,
  })

  return [
    pick(0, {
      id: 1,
      name: 'User 1',
      active: true,
      email: 'user1@example.com',
      department_id: 1,
    }),
    pick(1, {
      id: 2,
      name: 'User 2',
      active: false,
      email: 'user2@example.com',
      department_id: 2,
    }),
  ]
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('getUsers', () => {
  test('should return a list of users', async () => {
    const res = await getUsers()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })
  test.each(['true', 'false'] as const)(
    'should return a list of users with status %s',
    async (status) => {
      const users = makeUsersFixture()

      server.use(
        getGetUsersMockHandler((info) => {
          const url = new URL(info.request.url)
          const status = url.searchParams.get('active')
          return users.filter((user) => String(user.active) === status)
        }),
      )

      const res = await getUsers({ active: status === 'true' })
      expect(res.status).toBe(200)
      expect(Array.isArray(res.data)).toBe(true)
      expect(res.data).toHaveLength(1)
      expect(res.data[0].active).toBe(status === 'true')
    },
  )
  test('should return a list of users by departpment id', async () => {
    const users = makeUsersFixture().map((user) => ({
      ...user,
      department_id: 1,
    }))

    server.use(
      getGetUsersMockHandler((info) => {
        const url = new URL(info.request.url)
        const departmentId = url.searchParams.get('department_id')
        return users.filter(
          (user) => String(user.department_id) === departmentId,
        )
      }),
    )
    const res = await getUsers({ department_id: 1 })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBe(2)
  })

  test('should return a list of users by name', async () => {
    const users = makeUsersFixture().map((user) => ({
      ...user,
      department_id: 1,
    }))

    server.use(
      getGetUsersMockHandler((info) => {
        const url = new URL(info.request.url)
        const name = url.searchParams.get('name_like')
        return users.filter((user) => user.name.includes(name!))
      }),
    )
    const res = await getUsers({ name_like: '1' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBe(1)
    expect(res.data[0].name).toBe('User 1')
  })

  test('should return a list of users with their department information', async () => {
    const users: UserWithDepartment[] = makeUsersFixture()

    const departments: Department[] = getGetDepartmentsResponseMock()
      .slice(0, 2)
      .map((department, index) => ({
        ...department,
        id: index + 1,
        name: `Department ${index + 1}`,
        description: `Description ${index + 1}`,
      }))

    server.use(
      getGetUsersMockHandler((info) => {
        const url = new URL(info.request.url)
        const embed = url.searchParams.get('_embed')

        let data = [...users]

        if (embed === 'department') {
          data = data.map((user) => ({
            ...user,
            department: departments.find((d) => d.id === user.department_id),
          }))
        }

        return data
      }),
    )

    const res = await getUsers({ _embed: 'department' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data).toHaveLength(2)
    expect(res.data[0]).toHaveProperty('department')
    expect(res.data[0].department?.name).toBe('Department 1')
    expect(res.data[1]).toHaveProperty('department')
    expect(res.data[1].department?.name).toBe('Department 2')
  })
})

describe('getUserById', () => {
  test('should return user tools for user', async () => {
    const userTools: UserTool[] = getGetUserToolsResponseMock()
      .slice(0, 1)
      .map((relation) => ({
        ...relation,
        user_id: 1,
        tool_id: 1,
        usage_frequency: 'daily',
        last_used: '2023-01-01',
        proficiency_level: 'advanced',
      }))

    server.use(
      getGetUserToolsMockHandler((info) => {
        const url = new URL(info.request.url)
        const userId = url.searchParams.get('user_id')

        if (userId === '1') {
          return userTools
        }

        return []
      }),
    )

    const res = await getUserTools({ user_id: 1 })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data).toHaveLength(1)
    expect(res.data[0].user_id).toBe(1)
    expect(res.data[0].tool_id).toBe(1)
  })
})
