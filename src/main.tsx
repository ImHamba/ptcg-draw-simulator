import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import { CARD_DATA_PROXY_URL } from './lib/cardData.ts'
import { VERSION } from './lib/constants.ts'
import reportWebVitals from './reportWebVitals.ts'
import './styles.css'

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

// hold data
const cardDataCacheTime = 12 * 60 * 60 * 1000

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // never refetch data during a particular session
      staleTime: cardDataCacheTime,
      gcTime: cardDataCacheTime,
      retry: false,
    },
  },
})

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <PersistQueryClientProvider
        client={queryClient}
        // only refetch data upon page load if the data is old enough
        persistOptions={{
          persister: localStoragePersister,
          maxAge: cardDataCacheTime,
          buster: `${CARD_DATA_PROXY_URL}_${VERSION}`,
        }}
        onSuccess={() => console.log('success')}
        onError={() => console.log('error')}
      >
        <RouterProvider router={router} />
      </PersistQueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
