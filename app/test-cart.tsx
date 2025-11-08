"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function TestCartPage() {
  const router = useRouter()
  const [message, setMessage] = useState("")

  const testRouting = () => {
    try {
      // Test sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('test', 'hello')
        const data = sessionStorage.getItem('test')
        setMessage(`SessionStorage works: ${data}`)
      } else {
        setMessage("Window object not available")
      }

      // Test routing
      setTimeout(() => {
        router.push('/checkout')
      }, 1000)
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Cart Test Page</h1>
        <button
          onClick={testRouting}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Test Cart Routing
        </button>
        {message && (
          <div className="mt-4 p-4 bg-neutral-100 rounded-lg">
            <p>{message}</p>
          </div>
        )}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>This page tests if routing to checkout works.</p>
          <p>If you click the button, it should navigate to checkout.</p>
        </div>
      </div>
    </div>
  )
}