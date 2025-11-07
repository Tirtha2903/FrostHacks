// Mock API functions for data retrieval
import { dummyCloudKitchens, dummyMenuItems, dummyOrders, dummyUsers, dummyDeliveryPartners } from "./dummy-data"

// Cloud Kitchen APIs
export async function getCloudKitchens() {
  return dummyCloudKitchens
}

export async function getCloudKitchenById(id: string) {
  return dummyCloudKitchens.find((k) => k.id === id)
}

// Delivery Partner APIs
export async function getDeliveryPartners() {
  return dummyDeliveryPartners
}

export async function getAvailableDeliveryPartners() {
  return dummyDeliveryPartners.filter((dp) => dp.isAvailable)
}

export async function createDeliveryBid(bid: any) {
  return {
    id: `bid_${Date.now()}`,
    ...bid,
    status: "open",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60000) // 5 minutes expiry
  }
}

// Menu APIs
export async function getMenuItems(kitchenId: string) {
  return dummyMenuItems.filter((item) => item.restaurantId === kitchenId)
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
