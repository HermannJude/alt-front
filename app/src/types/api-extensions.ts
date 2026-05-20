import type { Department, Tool, User, UserTool } from '#/api/model'

export type UserWithDepartment = User & {
  department?: Department
}

export type ToolWithUserTools = Tool & {
  user_tools?: UserTool[]
}
