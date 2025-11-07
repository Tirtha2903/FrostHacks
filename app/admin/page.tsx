"use client"

import { useState, useEffect } from "react"
import { dummyOrders, dummyCloudKitchens, dummyUsers } from "@/lib/dummy-data"
import AdminHeader from "@/components/admin-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, DollarSign, Package, CheckCircle } from "lucide-react"

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    completedDeliveries: 0,
  })

  useEffect(() => {
    const totalOrders = dummyOrders.length
    const totalRevenue = dummyOrders.reduce((sum, o) => sum + o.total, 0)
    const completedDeliveries = dummyOrders.filter((o) => o.status === "delivered").length

    setStats({
      totalOrders,
      totalRevenue,
      activeUsers: dummyUsers.length,
      completedDeliveries,
    })
  }, [])

  // Revenue trend data
  const revenueData = [
    { day: "Mon", revenue: 1200, orders: 15 },
    { day: "Tue", revenue: 1900, orders: 22 },
    { day: "Wed", revenue: 1600, orders: 18 },
    { day: "Thu", revenue: 2200, orders: 28 },
    { day: "Fri", revenue: 2800, orders: 35 },
    { day: "Sat", revenue: 3200, orders: 42 },
    { day: "Sun", revenue: 2900, orders: 38 },
  ]

  // Order status distribution
  const orderStatusData = [
    { name: "Completed", value: dummyOrders.filter((o) => o.status === "delivered").length, fill: "#10b981" },
    { name: "In Transit", value: dummyOrders.filter((o) => o.status === "in_transit").length, fill: "#3b82f6" },
    { name: "Preparing", value: dummyOrders.filter((o) => o.status === "preparing").length, fill: "#f59e0b" },
    {
      name: "Pending",
      value: dummyOrders.filter((o) => ["pending", "confirmed"].includes(o.status)).length,
      fill: "#8b5cf6",
    },
  ]

  // Restaurant performance
  const restaurantData = dummyCloudKitchens.map((r) => ({
    name: r.name.split(" ")[0],
    orders: dummyOrders.filter((o) => o.kitchenId === r.id).length,
    revenue: dummyOrders.filter((o) => o.kitchenId === r.id).reduce((sum, o) => sum + o.total, 0),
  }))

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-2">+12% from last week</p>
              </div>
              <Package className="w-12 h-12 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-3xl font-bold">${(stats.totalRevenue / 100).toFixed(0)}</p>
                <p className="text-xs text-green-600 mt-2">+8% from last week</p>
              </div>
              <DollarSign className="w-12 h-12 text-secondary opacity-20" />
            </div>
          </div>

          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
                <p className="text-xs text-green-600 mt-2">All systems active</p>
              </div>
              <Users className="w-12 h-12 text-accent opacity-20" />
            </div>
          </div>

          <div className="bg-card border border-neutral-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Completed Deliveries</p>
                <p className="text-3xl font-bold">{stats.completedDeliveries}</p>
                <p className="text-xs text-green-600 mt-2">100% success rate</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="charts" className="w-full">
          <TabsList className="grid w-full max-w-2xl">
            <TabsTrigger value="charts">Revenue & Orders</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="users">Users & Orders</TabsTrigger>
          </TabsList>

          {/* Revenue & Orders Chart */}
          <TabsContent value="charts" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Line Chart */}
              <div className="lg:col-span-2 bg-card border border-neutral-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-6">Weekly Revenue & Orders</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#ff6b35" name="Revenue ($)" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#004e89" name="Orders" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Order Status Pie Chart */}
              <div className="bg-card border border-neutral-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-6">Order Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Restaurant Performance */}
          <TabsContent value="restaurants" className="mt-6">
            <div className="bg-card border border-neutral-200 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-6">Restaurant Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={restaurantData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#ff6b35" name="Orders" />
                  <Bar dataKey="revenue" fill="#004e89" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Users & Orders Table */}
          <TabsContent value="users" className="mt-6">
            <div className="bg-card border border-neutral-200 rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/5 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">User</th>
                    <th className="px-6 py-4 text-left font-bold">Role</th>
                    <th className="px-6 py-4 text-left font-bold">Email</th>
                    <th className="px-6 py-4 text-left font-bold">Status</th>
                    <th className="px-6 py-4 text-left font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyUsers.map((user) => (
                    <tr key={user.id} className="border-b border-neutral-200 hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{user.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Orders Table */}
        <div className="mt-8 bg-card border border-neutral-200 rounded-lg overflow-x-auto">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Recent Orders
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary/5 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Order ID</th>
                <th className="px-6 py-4 text-left font-bold">Customer</th>
                <th className="px-6 py-4 text-left font-bold">Restaurant</th>
                <th className="px-6 py-4 text-left font-bold">Status</th>
                <th className="px-6 py-4 text-left font-bold">Amount</th>
                <th className="px-6 py-4 text-left font-bold">Time</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.slice(0, 10).map((order) => {
                const customer = dummyUsers.find((u) => u.id === order.customerId)
                const restaurant = dummyCloudKitchens.find((r) => r.id === order.kitchenId)
                return (
                  <tr key={order.id} className="border-b border-neutral-200 hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">#{order.id.split("_")[1]}</td>
                    <td className="px-6 py-4">{customer?.name}</td>
                    <td className="px-6 py-4">{restaurant?.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "in_transit":
      return "bg-blue-100 text-blue-800"
    case "preparing":
      return "bg-yellow-100 text-yellow-800"
    case "pending":
    case "confirmed":
      return "bg-purple-100 text-purple-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-neutral-100 text-neutral-800"
  }
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
