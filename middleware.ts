// Temporarily disable middleware for easier deployment
// Authentication will be handled client-side only for now

export function middleware() {
  // No middleware logic for deployment compatibility
}

export const config = {
  matcher: [], // Empty matcher disables middleware
}