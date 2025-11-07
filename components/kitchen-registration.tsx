"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Store, MapPin, Clock, FileText, Users, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface KitchenRegistrationProps {
  onSuccess?: () => void
}

export default function KitchenRegistration({ onSuccess }: KitchenRegistrationProps) {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    // Basic Information
    kitchenName: "",
    kitchenType: "cloud_kitchen",
    description: "",
    cuisineTypes: [] as string[],

    // Location
    address: "",
    area: "",
    city: "",
    pincode: "",
    coordinates: { lat: "", lng: "" },

    // Operating Hours
    operatingHours: {
      open: "11:00",
      close: "23:00",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },

    // Business Details
    minOrderAmount: 150,
    deliveryTime: 30,
    deliveryFee: 2.99,
    subscriptionAvailable: true,

    // Documents
    businessLicense: "",
    fssaiLicense: "",
    gstNumber: "",

    // Contact
    ownerName: "",
    phone: "",
    email: "",

    // Agreement
    termsAccepted: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const cuisineOptions = [
    "Indian", "Chinese", "Italian", "Mexican", "Thai", "Japanese",
    "American", "Mediterranean", "Korean", "Vietnamese", "Continental",
    "Healthy", "Vegan", "Burgers", "Pizza", "Desserts", "Beverages"
  ]

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const kitchenTypes = [
    { id: "cloud_kitchen", label: "Cloud Kitchen", description: "Professional kitchen optimized for delivery" },
    { id: "home_office", label: "Home Office", description: "Operate from your home kitchen" },
    { id: "both", label: "Hybrid", description: "Both cloud kitchen and home operations" }
  ]

  const toggleCuisine = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.includes(cuisine)
        ? prev.cuisineTypes.filter(c => c !== cuisine)
        : [...prev.cuisineTypes, cuisine]
    }))
  }

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        days: prev.operatingHours.days.includes(day)
          ? prev.operatingHours.days.filter(d => d !== day)
          : [...prev.operatingHours.days, day]
      }
    }))
  }

  const updateField = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create user with kitchen role
      const userData = {
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: 'tempPassword123', // In production, you would collect this during registration
        role: 'kitchen' as const,
        kitchenName: formData.kitchenName,
        kitchenAddress: `${formData.address}, ${formData.area}, ${formData.city} - ${formData.pincode}`,
        fssaiLicense: formData.fssaiLicense,
        gstNumber: formData.gstNumber,
        cuisine: formData.cuisineTypes
      }

      const success = await register(userData)
      if (success) {
        router.push('/kitchen')
        onSuccess?.()
      } else {
        alert('Registration failed. Please try again.')
      }
    } catch (error) {
      alert('An error occurred during registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.kitchenName && formData.kitchenType && formData.description && formData.cuisineTypes.length > 0
      case 2:
        return formData.address && formData.city && formData.pincode
      case 3:
        return formData.operatingHours.days.length > 0
      case 4:
        return formData.businessLicense && formData.fssaiLicense
      case 5:
        return formData.ownerName && formData.phone && formData.email
      case 6:
        return formData.termsAccepted
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Kitchen Name *</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.kitchenName}
                  onChange={(e) => updateField("kitchenName", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your kitchen name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Kitchen Type *</label>
              <div className="space-y-3">
                {kitchenTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateField("kitchenType", type.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.kitchenType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium mb-1">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                      {formData.kitchenType === type.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                placeholder="Describe your kitchen and specialties"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Cuisine Types *</label>
              <p className="text-sm text-muted-foreground mb-3">Select all cuisines you specialize in</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.cuisineTypes.includes(cuisine)
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Location Details</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Complete Address *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="Street address, building number, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Area/Locality *</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Koramangala, Andheri"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Bangalore, Mumbai"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PIN Code *</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="560001"
                maxLength={6}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Location Verification</h4>
                  <p className="text-sm text-blue-800">
                    Our team will verify your kitchen location before onboarding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Operating Hours & Delivery Settings</h3>

            <div>
              <label className="block text-sm font-medium mb-3">Operating Days *</label>
              <p className="text-sm text-muted-foreground mb-3">Select days when your kitchen will be operational</p>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.operatingHours.days.includes(day)
                        ? "border-primary bg-primary text-white"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Opening Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="time"
                    value={formData.operatingHours.open}
                    onChange={(e) => updateField("operatingHours.open", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Closing Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="time"
                    value={formData.operatingHours.close}
                    onChange={(e) => updateField("operatingHours.close", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Min. Order Amount (₹) *</label>
                <input
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => updateField("minOrderAmount", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Avg. Delivery Time (min) *</label>
                <input
                  type="number"
                  value={formData.deliveryTime}
                  onChange={(e) => updateField("deliveryTime", parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="15"
                  max="90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Fee (₹) *</label>
                <input
                  type="number"
                  value={formData.deliveryFee}
                  onChange={(e) => updateField("deliveryFee", parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subscriptionAvailable}
                  onChange={(e) => updateField("subscriptionAvailable", e.target.checked)}
                  className="w-4 h-4"
                />
                <div>
                  <span className="font-medium">Offer Subscription Plans</span>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to subscribe for weekly/monthly meal plans
                  </p>
                </div>
              </label>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Legal Documents</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Document Requirements</h4>
                  <p className="text-sm text-yellow-800">
                    All legal documents are mandatory for verification. Ensure they are valid and clear.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Business License Number *</label>
              <input
                type="text"
                value={formData.businessLicense}
                onChange={(e) => updateField("businessLicense", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your business license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">FSSAI License Number *</label>
              <input
                type="text"
                value={formData.fssaiLicense}
                onChange={(e) => updateField("fssaiLicense", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="FSSAI/XXXXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GST Number (Optional)</label>
              <input
                type="text"
                value={formData.gstNumber}
                onChange={(e) => updateField("gstNumber", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="XXAAAAA0000A1ZV"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Owner/Manager Name *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => updateField("ownerName", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>

            <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Application Summary</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Kitchen Name:</span>
                  <p className="font-medium">{formData.kitchenName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">
                    {kitchenTypes.find(t => t.id === formData.kitchenType)?.label}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cuisines:</span>
                  <p className="font-medium">{formData.cuisineTypes.join(", ")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{formData.city}, {formData.pincode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contact:</span>
                  <p className="font-medium">{formData.ownerName} - {formData.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Operating Days:</span>
                  <p className="font-medium">{formData.operatingHours.days.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => updateField("termsAccepted", e.target.checked)}
                  className="mt-1"
                />
                <div className="text-sm">
                  <p className="font-medium mb-1">Terms and Agreement</p>
                  <p className="text-muted-foreground">
                    I agree to the platform's terms of service, food safety regulations, and quality standards.
                    I confirm that all information provided is accurate and I have all necessary licenses and permits.
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Next Steps</h4>
                  <p className="text-sm text-green-800">
                    After submission, our team will review your application within 2-3 business days.
                    We'll contact you for kitchen verification and document validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border max-w-3xl mx-auto">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Register Your Kitchen</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 6
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-2 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-neutral-200"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {renderStep()}

        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep === 6 ? (
            <button
              type="submit"
              disabled={!canProceed() || loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
              disabled={!canProceed()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  )
}