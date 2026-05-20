import { getDepartments } from '#/api/default/default'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { getDefaultMock } from '../../api/default/default.msw'

const server = setupServer(...getDefaultMock([]))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('getDepartments', () => {
  test('should return a list of departments', async () => {
    const res = await getDepartments()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })
})
