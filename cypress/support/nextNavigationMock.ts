// Mock for next/navigation used in Cypress component tests
// Compatible with Next.js 14+ App Router

let currentPath = '/'
let searchParams = new URLSearchParams()

export const useRouter = () => ({
  push: (path: string) => {
    currentPath = path
    // Parse search params from path
    const url = new URL(path, 'http://localhost')
    searchParams = url.searchParams
  },
  replace: (path: string) => {
    currentPath = path
  },
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => Promise.resolve(),
})

export const usePathname = () => {
  try {
    const url = new URL(currentPath, 'http://localhost')
    return url.pathname
  } catch {
    return currentPath.split('?')[0]
  }
}

export const useSearchParams = () => searchParams

export const useParams = () => ({})

export const redirect = (path: string) => {
  currentPath = path
}

export const notFound = () => {
  throw new Error('Not Found')
}

// Helper to get current path in tests
export const __getCurrentPath = () => currentPath

// Helper to reset state between tests
export const __resetNavigation = () => {
  currentPath = '/'
  searchParams = new URLSearchParams()
}
