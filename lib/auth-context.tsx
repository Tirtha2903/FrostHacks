'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: User['role']) => Promise<boolean>
  logout: () => void
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user storage (in production, this would be handled by a backend)
const USERS_STORAGE_KEY = 'cloudbites_users'
const CURRENT_USER_KEY = 'cloudbites_current_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY)
    return users ? JSON.parse(users) : []
  }

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }

  const login = async (email: string, password: string, role: User['role']): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const users = getUsers()
    const foundUser = users.find(u => u.email === email && u.role === role)

    if (foundUser) {
      // In production, you would hash and compare passwords properly
      // For demo purposes, we'll accept any password for existing users
      setUser(foundUser)
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(CURRENT_USER_KEY)
  }

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const users = getUsers()

    // Check if user already exists
    if (users.some(u => u.email === userData.email)) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      phone: userData.phone || '',
      role: userData.role!,
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name!)}&background=random`,
      createdAt: new Date().toISOString(),
      // Add role-specific fields
      ...(userData.role === 'kitchen' && {
        kitchenName: userData.kitchenName || '',
        kitchenAddress: userData.kitchenAddress || '',
        fssaiLicense: userData.fssaiLicense || '',
        gstNumber: userData.gstNumber || '',
        cuisine: userData.cuisine || []
      }),
      ...(userData.role === 'delivery' && {
        vehicleType: userData.vehicleType || 'motorcycle',
        licenseNumber: userData.licenseNumber || '',
        aadharNumber: userData.aadharNumber || ''
      })
    }

    users.push(newUser)
    saveUsers(users)

    // Auto-login after registration
    setUser(newUser)
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))

    setIsLoading(false)
    return true
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}