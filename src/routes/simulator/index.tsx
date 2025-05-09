import SimulatorPage from '@/lib/components/SimulatorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/simulator/')({
  component: App,
})

function App() {
  return <SimulatorPage />
}
