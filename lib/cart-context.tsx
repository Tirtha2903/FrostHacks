'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CloudKitchen, MenuItem } from '@/lib/types'

interface CartItem {
  item: MenuItem
  quantity: number
  specialInstructions?: string
}

interface CartContextType {
  cart: CartItem[]
  kitchen: CloudKitchen | null
  addToCart: (item: MenuItem, quantity?: number, instructions?: string, kitchen?: CloudKitchen) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  getTotalItems: () => number
  cartSubtotal: number
  deliveryFee: number
  platformFee: number
  cartTotal: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Storage keys
const CART_STORAGE_KEY = 'cloudbites_cart'
const KITCHEN_STORAGE_KEY = 'cloudbites_kitchen'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [kitchen, setKitchen] = useState<CloudKitchen | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      const savedKitchen = localStorage.getItem(KITCHEN_STORAGE_KEY)

      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
      if (savedKitchen) {
        setKitchen(JSON.parse(savedKitchen))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY)
      localStorage.removeItem(KITCHEN_STORAGE_KEY)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } else {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [cart])

  // Save kitchen to localStorage whenever it changes
  useEffect(() => {
    if (kitchen) {
      localStorage.setItem(KITCHEN_STORAGE_KEY, JSON.stringify(kitchen))
    } else {
      localStorage.removeItem(KITCHEN_STORAGE_KEY)
    }
  }, [kitchen])

  const addToCart = (item: MenuItem, quantity = 1, instructions?: string, kitchenInfo?: CloudKitchen) => {
    // Check if adding from a different kitchen
    if (kitchenInfo && kitchen && kitchen.id !== kitchenInfo.id) {
      // Clear cart if switching kitchens
      if (window.confirm('Adding items from a different kitchen will clear your current cart. Continue?')) {
        setCart([{ item, quantity, specialInstructions: instructions }])
        setKitchen(kitchenInfo)
      }
      return
    }

    // Set kitchen if not set
    if (kitchenInfo && !kitchen) {
      setKitchen(kitchenInfo)
    }

    setCart(prevCart => {
      const existingItem = prevCart.find((c) => c.item.id === item.id)

      if (existingItem) {
        return prevCart.map((c) =>
          c.item.id === item.id
            ? {
                ...c,
                quantity: c.quantity + quantity,
                specialInstructions: instructions || c.specialInstructions,
              }
            : c
        )
      } else {
        return [...prevCart, { item, quantity, specialInstructions: instructions }]
      }
    })

    // Open cart when adding items
    setIsOpen(true)
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter((c) => c.item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(prevCart =>
        prevCart.map((c) =>
          c.item.id === itemId ? { ...c, quantity } : c
        )
      )
    }
  }

  const clearCart = () => {
    setCart([])
    setKitchen(null)
    localStorage.removeItem(CART_STORAGE_KEY)
    localStorage.removeItem(KITCHEN_STORAGE_KEY)
  }

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.length
  }

  // Calculate derived values
  const cartSubtotal = getCartTotal()
  const deliveryFee = kitchen?.deliveryFee || 0
  const platformFee = 2.50
  const cartTotal = cartSubtotal + deliveryFee + platformFee

  const value: CartContextType = {
    cart,
    kitchen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getTotalItems,
    cartSubtotal,
    deliveryFee,
    platformFee,
    cartTotal,
    isOpen,
    setIsOpen
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}