import HomePage from '@/lib/components/homepage/HomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <HomePage />,
})
