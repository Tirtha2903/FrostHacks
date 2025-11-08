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
import { Loader2, User, ChefHat, Truck, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<'customer' | 'kitchen' | 'delivery' | 'admin'>('customer')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated } = useAuth()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password, selectedRole)
      if (success) {
        // Redirect based on role
        switch (selectedRole) {
          case 'kitchen':
            router.push('/kitchen')
            break
          case 'delivery':
            router.push('/delivery')
            break
          case 'admin':
            router.push('/admin')
            break
          default:
            router.push('/')
        }
      } else {
        setError('Invalid email or password. For demo, any password works if email exists.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const roleIcons = {
    customer: User,
    kitchen: ChefHat,
    delivery: Truck,
    admin: Shield
  }

  const roleDescriptions = {
    customer: 'Order delicious food from cloud kitchens',
    kitchen: 'Manage your cloud kitchen and orders',
    delivery: 'Deliver food and earn money',
    admin: 'Manage the entire platform'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to CloudBites
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Select your role and enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                {Object.entries(roleIcons).map(([role, Icon]) => (
                  <TabsTrigger key={role} value={role} className="flex flex-col items-center gap-1 p-2">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs capitalize">{role}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(roleDescriptions).map(([role, description]) => (
                <TabsContent key={role} value={role}>
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>

            <div className="text-center text-xs text-gray-500">
              Demo: Use any email and password. Register first to create an account.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}