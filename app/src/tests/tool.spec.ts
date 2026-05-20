import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { getTools, getToolsId } from '../api/default/default'
import {
  getDefaultMock,
  getGetToolsIdMockHandler,
} from '../api/default/default.msw'

const server = setupServer(...getDefaultMock())

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Tools', () => {
  test('should return a list of tools', async () => {
    const res = await getTools()
    expect(res.status).toBe(200)
    expect(Array.isArray(res.data)).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })

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
