"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useEffect } from "react"

export default function CartPage() {
    const router = useRouter()
    const { isAuthenticated, user } = useAuth()
    const {
        cart,
        kitchen,
        removeFromCart,
        updateQuantity,
        getCartItemCount,
        cartSubtotal,
        deliveryFee,
        platformFee,
        cartTotal,
        clearCart
    } = useCart()

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'customer') {
            router.push('/auth/login')
            return
        }
    }, [isAuthenticated, user, router])

    const handleCheckout = () => {
        if (kitchen && cart.length > 0) {
            const orderData = {
                kitchenId: kitchen.id,
                items: cart.map(c => ({
                    menuItemId: c.item.id,
                    name: c.item.name,
                    quantity: c.quantity,
                    price: c.item.price,
                    specialInstructions: c.specialInstructions
                })),
                subtotal: cartSubtotal,
                deliveryFee,
                platformFee,
                total: cartTotal
            }
            sessionStorage.setItem('orderData', JSON.stringify(orderData))
            router.push('/checkout')
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {getCartItemCount() === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-24 h-24 mx-auto text-neutral-300 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">Add some delicious food to get started!</p>
                        <Button onClick={() => router.push('/')}>Browse Cloud Kitchens</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Kitchen Info */}
                            {kitchen && (
                                <div className="bg-white p-4 rounded-lg border">
                                    <h2 className="font-semibold text-lg mb-2">{kitchen.name}</h2>
                                    <p className="text-sm text-gray-600">{kitchen.cuisineType.join(", ")}</p>
                                </div>
                            )}

                            {cart.map((cartItem) => (
                                <div
                                    key={cartItem.item.id}
                                    className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={cartItem.item.image || "https://picsum.photos/seed/food-item/80/80.jpg"}
                                            alt={cartItem.item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://picsum.photos/seed/food-placeholder/80/80.jpg"
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{cartItem.item.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">{cartItem.item.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(cartItem.item.id, Math.max(1, cartItem.quantity - 1))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="font-semibold w-8 text-center">{cartItem.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 hover:bg-neutral-100"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary">₹{(cartItem.item.price * cartItem.quantity).toFixed(2)}</p>
                                                    <p className="text-sm text-gray-500">₹{cartItem.item.price} each</p>
                                                </div>
                                            </div>
                                            {cartItem.specialInstructions && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <strong>Note:</strong> {cartItem.specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(cartItem.item.id)}
                                            className="text-red-500 hover:text-red-600 p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                onClick={clearCart}
                                className="w-full"
                            >
                                Clear Cart
                            </Button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200 sticky top-24">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-semibold">₹{cartSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Platform Fee</span>
                                        <span className="font-semibold">₹{platformFee.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg">
                                        <span className="font-bold">Total</span>
                                        <span className="font-bold text-primary">₹{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {kitchen && kitchen.subscriptionAvailable && (
                                    <Button variant="outline" className="w-full mb-3">
                                        Setup Subscription
                                    </Button>
                                )}

                                <Button onClick={handleCheckout} className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/')}
                                    className="w-full mt-3"
                                >
                                    Continue Shopping
                                </Button>

                                {kitchen && (
                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        Estimated delivery: {kitchen.deliveryTime} minutes
                                        <br />
                                        Min. Order: ₹{kitchen.minOrderAmount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
