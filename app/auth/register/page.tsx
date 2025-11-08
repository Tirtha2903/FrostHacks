'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, User, ChefHat, Truck, Utensils } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'customer' | 'kitchen' | 'delivery',
    // Kitchen specific
    kitchenName: '',
    kitchenAddress: '',
    fssaiLicense: '',
    gstNumber: '',
    cuisine: [] as string[],
    // Delivery specific
    vehicleType: 'motorcycle' as 'motorcycle' | 'scooter' | 'car',
    licenseNumber: '',
    aadharNumber: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const { register, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated - moved to useEffect
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // Return null if authenticated to prevent flash of content
  if (isAuthenticated) {
    return null
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      return 'All fields are required'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters'
    }

    if (formData.role === 'kitchen' && (!formData.kitchenName || !formData.kitchenAddress)) {
      return 'Kitchen name and address are required'
    }

    if (formData.role === 'delivery' && (!formData.licenseNumber || !formData.aadharNumber)) {
      return 'License and Aadhar numbers are required'
    }

    if (!agreedToTerms) {
      return 'You must agree to the terms and conditions'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'kitchen' && {
          kitchenName: formData.kitchenName,
          kitchenAddress: formData.kitchenAddress,
          fssaiLicense: formData.fssaiLicense,
          gstNumber: formData.gstNumber,
          cuisine: formData.cuisine
        }),
        ...(formData.role === 'delivery' && {
          vehicleType: formData.vehicleType,
          licenseNumber: formData.licenseNumber,
          aadharNumber: formData.aadharNumber
        })
      }

      const success = await register(userData)
      if (success) {
        // Redirect based on role
        switch (formData.role) {
          case 'kitchen':
            router.push('/kitchen')
            break
          case 'delivery':
            router.push('/delivery')
            break
          default:
            router.push('/')
        }
      } else {
        setError('An account with this email already exists')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const cuisineOptions = [
    'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican',
    'Continental', 'Biryani', 'Street Food', 'Healthy Food', 'Desserts'
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Join CloudBites
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Choose your role and fill in your details
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as any }))}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer" className="flex flex-col items-center gap-1 p-2">
                  <User className="h-4 w-4" />
                  <span className="text-xs">Customer</span>
                </TabsTrigger>
                <TabsTrigger value="kitchen" className="flex flex-col items-center gap-1 p-2">
                  <ChefHat className="h-4 w-4" />
                  <span className="text-xs">Kitchen</span>
                </TabsTrigger>
                <TabsTrigger value="delivery" className="flex flex-col items-center gap-1 p-2">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs">Delivery</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                {/* Role-specific fields */}
                {formData.role === 'kitchen' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Kitchen Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="kitchenName">Kitchen Name</Label>
                        <Input
                          id="kitchenName"
                          value={formData.kitchenName}
                          onChange={(e) => handleInputChange('kitchenName', e.target.value)}
                          placeholder="Enter your kitchen name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="fssaiLicense">FSSAI License</Label>
                        <Input
                          id="fssaiLicense"
                          value={formData.fssaiLicense}
                          onChange={(e) => handleInputChange('fssaiLicense', e.target.value)}
                          placeholder="FSSAI license number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kitchenAddress">Kitchen Address</Label>
                      <Input
                        id="kitchenAddress"
                        value={formData.kitchenAddress}
                        onChange={(e) => handleInputChange('kitchenAddress', e.target.value)}
                        placeholder="Enter kitchen address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        placeholder="GST number if applicable"
                      />
                    </div>
                  </div>
                )}

                {formData.role === 'delivery' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleType">Vehicle Type</Label>
                        <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                          placeholder="Driving license number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Number</Label>
                      <Input
                        id="aadharNumber"
                        value={formData.aadharNumber}
                        onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                        placeholder="Aadhar card number"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}