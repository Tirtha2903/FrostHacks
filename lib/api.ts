// Mock API functions for data retrieval
import { dummyRestaurants, dummyMenuItems, dummyOrders, dummyUsers } from "./dummy-data"

// Restaurant APIs
export async function getRestaurants() {
  return dummyRestaurants
}

export async function getRestaurantById(id: string) {
  return dummyRestaurants.find((r) => r.id === id)
}

// Menu APIs
export async function getMenuItems(restaurantId: string) {
  return dummyMenuItems.filter((item) => item.restaurantId === restaurantId)
}

export async function getMenuItemById(id: string) {
  return dummyMenuItems.find((item) => item.id === id)
}

// Order APIs
export async function getOrders(userId: string) {
  return dummyOrders.filter((order) => order.customerId === userId)
}

export async function createOrder(order: any) {
  const newOrder = {
    ...order,
    id: `order_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "pending",
  }
  dummyOrders.push(newOrder)
  return newOrder
}

// User APIs
export async function getUser(id: string) {
  return dummyUsers.find((u) => u.id === id)
}
