import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tools')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tools"!</div>
}
