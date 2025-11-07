"use client"

import type React from "react"

import { Search } from "lucide-react"
import { useState } from "react"

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void
}) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
      <input
        type="text"
        placeholder="Search restaurants, cuisines, or dishes..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onSearch(e.target.value)
        }}
        className="w-full pl-12 pr-6 py-4 bg-white rounded-lg text-foreground placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </form>
  )
}
