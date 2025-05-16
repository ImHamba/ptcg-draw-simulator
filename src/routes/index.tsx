import HomePage from '@/lib/components/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <HomePage />,
})
