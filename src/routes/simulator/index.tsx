import SimulatorPage from '@/lib/components/simulator/SimulatorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/simulator/')({
  component: () => <SimulatorPage />,
})
