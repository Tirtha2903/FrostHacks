"use client"

import { useState } from "react"
import { Calendar, Clock, Users, Check, ChevronDown } from "lucide-react"

interface SubscriptionOrderProps {
  kitchenId: string
  onSubscriptionSelect: (subscription: SubscriptionDetails) => void
}

export interface SubscriptionDetails {
  type: "weekly" | "monthly"
  deliveryDays: string[]
  mealTimes: string[]
  startDate: string
  endDate: string
  portions: number
}

export default function SubscriptionOrder({ kitchenId, onSubscriptionSelect }: SubscriptionOrderProps) {
  const [subscriptionType, setSubscriptionType] = useState<"weekly" | "monthly">("weekly")
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Wed", "Fri"])
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>(["lunch"])
  const [portions, setPortions] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const mealTimes = [
    { id: "breakfast", label: "Breakfast", time: "7:00 AM - 10:00 AM" },
    { id: "lunch", label: "Lunch", time: "12:00 PM - 2:00 PM" },
    { id: "dinner", label: "Dinner", time: "7:00 PM - 9:00 PM" }
  ]

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const toggleMealTime = (mealTime: string) => {
    setSelectedMealTimes(prev =>
      prev.includes(mealTime)
        ? prev.filter(mt => mt !== mealTime)
        : [...prev, mealTime]
    )
  }

  const calculateSubscription = () => {
    const today = new Date()
    let endDate = new Date(today)

    if (subscriptionType === "weekly") {
      endDate.setDate(today.getDate() + 7)
    } else {
      endDate.setDate(today.getDate() + 30)
    }

    return {
      type: subscriptionType,
      deliveryDays: selectedDays,
      mealTimes: selectedMealTimes,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      portions
    }
  }

  const handleContinue = () => {
    const subscription = calculateSubscription()
    onSubscriptionSelect(subscription)
  }

  const getTotalDeliveries = () => {
    const deliveriesPerWeek = selectedDays.length * selectedMealTimes.length
    return subscriptionType === "weekly" ? deliveriesPerWeek : deliveriesPerWeek * 4
  }

  const getEstimatedPrice = () => {
    const basePricePerMeal = 120 // Base price estimate
    const totalMeals = getTotalDeliveries()
    return basePricePerMeal * totalMeals * portions
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Setup Your Subscription</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure your meal delivery schedule for regular office or home deliveries
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Subscription Type */}
        <div>
          <label className="block text-sm font-medium mb-3">Subscription Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSubscriptionType("weekly")}
              className={`p-4 rounded-lg border-2 transition-all ${
                subscriptionType === "weekly"
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="font-medium mb-1">Weekly</div>
              <div className="text-sm text-muted-foreground">7 days cycle</div>
              <div className="text-xs text-primary mt-2">Best for trying out</div>
            </button>
            <button
              onClick={() => setSubscriptionType("monthly")}
              className={`p-4 rounded-lg border-2 transition-all ${
                subscriptionType === "monthly"
                  ? "border-primary bg-primary/5"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="font-medium mb-1">Monthly</div>
              <div className="text-sm text-muted-foreground">30 days cycle</div>
              <div className="text-xs text-primary mt-2">Save 15% more</div>
            </button>
          </div>
        </div>

        {/* Delivery Days */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Delivery Days</label>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedDays.includes(day)
                    ? "border-primary bg-primary text-white"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          {selectedDays.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one delivery day</p>
          )}
        </div>

        {/* Meal Times */}
        <div>
          <label className="block text-sm font-medium mb-3">Select Meal Times</label>
          <div className="space-y-3">
            {mealTimes.map((meal) => (
              <button
                key={meal.id}
                onClick={() => toggleMealTime(meal.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedMealTimes.includes(meal.id)
                    ? "border-primary bg-primary/5"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {selectedMealTimes.includes(meal.id) && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                      {meal.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{meal.time}</div>
                  </div>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
          {selectedMealTimes.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one meal time</p>
          )}
        </div>

        {/* Portions */}
        <div>
          <label className="block text-sm font-medium mb-3">Number of Portions</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPortions(Math.max(1, portions - 1))}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
            >
              -
            </button>
            <div className="text-center min-w-[60px]">
              <div className="text-2xl font-bold">{portions}</div>
              <div className="text-xs text-muted-foreground">portions</div>
            </div>
            <button
              onClick={() => setPortions(Math.min(10, portions + 1))}
              className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-primary/5 rounded-lg p-4">
          <h4 className="font-medium mb-3">Subscription Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{subscriptionType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days:</span>
              <span className="font-medium">{selectedDays.join(", ") || "None selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meals:</span>
              <span className="font-medium">{selectedMealTimes.map(mt =>
                mealTimes.find(m => m.id === mt)?.label
              ).join(", ") || "None selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Deliveries:</span>
              <span className="font-medium">{getTotalDeliveries()} meals</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-muted-foreground">Estimated Total:</span>
              <span className="text-xl font-bold text-primary">₹{getEstimatedPrice()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedDays.length === 0 || selectedMealTimes.length === 0}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue with Subscription
        </button>
      </div>
    </div>
  )
}