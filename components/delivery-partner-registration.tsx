"use client"

import { useState } from "react"
import { Bike, Car, Zap, Users, MapPin, Phone, Mail, FileText, CheckCircle } from "lucide-react"

interface DeliveryPartnerRegistrationProps {
  onSuccess: () => void
}

export default function DeliveryPartnerRegistration({ onSuccess }: DeliveryPartnerRegistrationProps) {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    phone: "",
    email: "",
    address: "",

    // Vehicle Information
    availableVehicles: [] as string[],
    preferredVehicleType: "",

    // Documents
    aadharNumber: "",
    drivingLicenseNumber: "",
    vehicleRegistrationNumber: "",
    bankAccountNumber: "",
    ifscCode: "",

    // Agreement
    termsAccepted: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const vehicleTypes = [
    { id: "cycle", label: "Cycle", icon: Bike, description: "Eco-friendly, great for short distances" },
    { id: "e_vehicle", label: "E-Vehicle", icon: Zap, description: "Fast and sustainable delivery" },
    { id: "motorcycle", label: "Motorcycle", icon: Bike, description: "Quick navigation through traffic" },
    { id: "car", label: "Car", icon: Car, description: "Large orders, weather protection" },
    { id: "public_transport", label: "Public Transport", icon: Users, description: "Cost-effective option" }
  ]

  const toggleVehicle = (vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      availableVehicles: prev.availableVehicles.includes(vehicleId)
        ? prev.availableVehicles.filter(v => v !== vehicleId)
        : [...prev.availableVehicles, vehicleId]
    }))
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.phone && formData.email
      case 2:
        return formData.availableVehicles.length > 0 && formData.preferredVehicleType
      case 3:
        return formData.aadharNumber && formData.drivingLicenseNumber && formData.vehicleRegistrationNumber
      case 4:
        return formData.bankAccountNumber && formData.ifscCode
      case 5:
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
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Enter your complete address"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>

            <div>
              <label className="block text-sm font-medium mb-3">Available Vehicles *</label>
              <p className="text-sm text-muted-foreground mb-4">
                Select all vehicles you can use for delivery
              </p>
              <div className="grid gap-3">
                {vehicleTypes.map((vehicle) => {
                  const Icon = vehicle.icon
                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => toggleVehicle(vehicle.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.availableVehicles.includes(vehicle.id)
                          ? "border-primary bg-primary/5"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          formData.availableVehicles.includes(vehicle.id)
                            ? "bg-primary text-white"
                            : "bg-neutral-100"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{vehicle.label}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.description}</div>
                        </div>
                        {formData.availableVehicles.includes(vehicle.id) && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Vehicle Type *</label>
              <select
                value={formData.preferredVehicleType}
                onChange={(e) => updateField("preferredVehicleType", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select preferred vehicle</option>
                {formData.availableVehicles.map((vehicleId) => {
                  const vehicle = vehicleTypes.find(v => v.id === vehicleId)
                  return (
                    <option key={vehicleId} value={vehicleId}>
                      {vehicle?.label}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Document Verification</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Document Requirements</h4>
                  <p className="text-sm text-blue-800">
                    All documents are mandatory for verification. Please ensure they are clear and valid.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Aadhar Card Number *</label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) => updateField("aadharNumber", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="XXXX-XXXX-XXXX"
                maxLength={12}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Driving License Number *</label>
              <input
                type="text"
                value={formData.drivingLicenseNumber}
                onChange={(e) => updateField("drivingLicenseNumber", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="DL-XXXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Vehicle Registration Number *</label>
              <input
                type="text"
                value={formData.vehicleRegistrationNumber}
                onChange={(e) => updateField("vehicleRegistrationNumber", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="XX-XX-XX-XXXX"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Secure Payments</h4>
                  <p className="text-sm text-green-800">
                    Your bank details are encrypted and used only for payment processing.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bank Account Number *</label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your account number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">IFSC Code *</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => updateField("ifscCode", e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="XXXX0000XXX"
                maxLength={11}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>

            <div className="bg-neutral-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium">Application Summary</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Available Vehicles:</span>
                  <p className="font-medium">
                    {formData.availableVehicles.map(v =>
                      vehicleTypes.find(vt => vt.id === v)?.label
                    ).join(", ")}
                  </p>
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
                  <p className="font-medium mb-1">Terms and Conditions</p>
                  <p className="text-muted-foreground">
                    I agree to the terms of service, privacy policy, and delivery partner guidelines.
                    I confirm that all information provided is accurate and I have all necessary documents.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border max-w-2xl mx-auto">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Become a Delivery Partner</h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
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

          {currentStep === 5 ? (
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
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
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