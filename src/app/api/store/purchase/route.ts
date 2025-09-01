import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, authService } from '@/lib/auth'
import { z } from 'zod'

const purchaseSchema = z.object({
  itemId: z.string(),
  itemType: z.enum(['supplement', 'equipment', 'subscription']),
  quantity: z.number().min(1).max(10).optional().default(1),
  paymentMethod: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
  shippingAddress: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }).optional()
})

// Sample product catalog
const PRODUCT_CATALOG = {
  supplements: {
    'forge_fuel_protein': {
      id: 'forge_fuel_protein',
      name: 'Forge Fuel Protein',
      price: 89.99,
      description: 'Premium whey protein to fuel your fitness forge',
      category: 'protein',
      fitnessBonus: {
        materials: { 'protein_crystal': 10, 'strength_essence': 5 },
        xpBonus: 50
      },
      inventory: 100
    },
    'endurance_elixir': {
      id: 'endurance_elixir',
      name: 'Endurance Elixir',
      price: 45.99,
      description: 'Pre-workout blend for maximum forge intensity',
      category: 'pre_workout',
      fitnessBonus: {
        materials: { 'cardio_energy': 15, 'motivation_spark': 2 },
        xpBonus: 75
      },
      inventory: 150
    },
    'recovery_nectar': {
      id: 'recovery_nectar',
      name: 'Recovery Nectar',
      price: 65.99,
      description: 'Post-workout recovery formula for forge masters',
      category: 'recovery',
      fitnessBonus: {
        materials: { 'recovery_aura': 20, 'flexibility_flow': 8 },
        xpBonus: 60
      },
      inventory: 75
    }
  },
  equipment: {
    'forge_master_dumbbells': {
      id: 'forge_master_dumbbells',
      name: 'Forge Master Dumbbells',
      price: 299.99,
      description: 'Professional-grade dumbbells for your home forge',
      category: 'weights',
      fitnessBonus: {
        workoutEfficiency: 1.2, // 20% more XP from strength workouts
        materials: { 'strength_essence': 5 },
        xpBonus: 100
      },
      inventory: 25
    },
    'anvil_resistance_bands': {
      id: 'anvil_resistance_bands',
      name: 'Anvil Resistance Bands',
      price: 79.99,
      description: 'Variable resistance bands for forge flexibility training',
      category: 'bands',
      fitnessBonus: {
        workoutEfficiency: 1.15, // 15% more XP from flexibility workouts
        materials: { 'flexibility_flow': 8, 'recovery_aura': 3 },
        xpBonus: 75
      },
      inventory: 50
    },
    'forge_cardio_tracker': {
      id: 'forge_cardio_tracker',
      name: 'Forge Cardio Tracker',
      price: 199.99,
      description: 'Advanced fitness tracker for forge masters',
      category: 'wearable',
      fitnessBonus: {
        materialBonus: 1.25, // 25% more materials from all workouts
        xpBonus: 150,
        features: ['heart_rate', 'calorie_tracking', 'workout_detection']
      },
      inventory: 30
    }
  },
  subscriptions: {
    'fitforge_pro': {
      id: 'fitforge_pro',
      name: 'FitForge Pro',
      price: 29.99,
      description: 'Monthly pro subscription with exclusive features',
      category: 'subscription',
      duration: 30, // days
      benefits: {
        xpMultiplier: 1.5,
        materialMultiplier: 1.3,
        exclusiveWorkouts: true,
        advancedAnalytics: true,
        prioritySupport: true,
        exclusiveEquipment: true
      },
      inventory: 999
    },
    'fitforge_elite': {
      id: 'fitforge_elite',
      name: 'FitForge Elite',
      price: 99.99,
      description: 'Premium elite subscription for forge legends',
      category: 'subscription',
      duration: 30, // days
      benefits: {
        xpMultiplier: 2.0,
        materialMultiplier: 1.5,
        exclusiveWorkouts: true,
        advancedAnalytics: true,
        prioritySupport: true,
        exclusiveEquipment: true,
        personalCoach: true,
        customWorkouts: true
      },
      inventory: 999
    }
  }
}

interface Order {
  id: string
  userId: string
  items: Array<{
    productId: string
    productType: string
    quantity: number
    price: number
    fitnessBonus: any
  }>
  totalAmount: number
  paymentMethod: string
  shippingAddress?: any
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  estimatedDelivery?: Date
}

// In production, this would be in a database
const orders: Map<string, Order> = new Map()

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const purchaseData = purchaseSchema.parse(body)
    
    // Find product in catalog
    const allProducts = {
      ...PRODUCT_CATALOG.supplements,
      ...PRODUCT_CATALOG.equipment,
      ...PRODUCT_CATALOG.subscriptions
    }
    
    const product = allProducts[purchaseData.itemId as keyof typeof allProducts]
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check inventory
    if (product.inventory < purchaseData.quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = product.price * purchaseData.quantity

    // Simulate payment processing
    const paymentSuccess = await simulatePayment(
      purchaseData.paymentMethod,
      totalAmount
    )

    if (!paymentSuccess) {
      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 402 }
      )
    }

    // Create order
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const order: Order = {
      id: orderId,
      userId: user.id,
      items: [{
        productId: product.id,
        productType: purchaseData.itemType,
        quantity: purchaseData.quantity,
        price: product.price,
        fitnessBonus: (product as any).fitnessBonus || (product as any).benefits || {}
      }],
      totalAmount,
      paymentMethod: purchaseData.paymentMethod,
      shippingAddress: purchaseData.shippingAddress,
      status: 'processing',
      createdAt: new Date(),
      estimatedDelivery: purchaseData.itemType !== 'subscription' 
        ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days for physical items
        : undefined
    }

    orders.set(orderId, order)

    // Update inventory
    product.inventory -= purchaseData.quantity

    // Apply fitness bonuses immediately for digital items
    let userUpdates: any = {}
    
    if (purchaseData.itemType === 'subscription') {
      // Update user subscription status
      const currentExpiry = user.subscription !== 'free' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date()
      const newExpiry = new Date(currentExpiry.getTime() + (product as any).duration * 24 * 60 * 60 * 1000)
      
      userUpdates.subscription = product.id === 'fitforge_elite' ? 'elite' : 'pro'
      userUpdates.subscriptionExpiry = newExpiry
    }

    // Add bonus materials and XP
    const bonus = (product as any).fitnessBonus || (product as any).benefits || {}
    if (bonus.materials) {
      userUpdates.materialsCollected = {
        ...user.stats.materialsCollected,
        ...Object.fromEntries(
          Object.entries(bonus.materials as Record<string, number>).map(([material, amount]) => [
            material,
            (user.stats.materialsCollected[material] || 0) + (amount * purchaseData.quantity)
          ])
        )
      }
    }

    if (bonus.xpBonus) {
      const currentXp = user.xp || 0
      userUpdates.xp = currentXp + (bonus.xpBonus * purchaseData.quantity)
    }

    // Update user if there are bonuses to apply
    let updatedUser = user
    if (Object.keys(userUpdates).length > 0) {
      const statsUpdates = userUpdates.materialsCollected ? { materialsCollected: userUpdates.materialsCollected } : {}
      updatedUser = await authService.updateUserStats(user.id, statsUpdates) || user
    }

    // Generate receipt
    const receipt = {
      orderId,
      purchaseDate: order.createdAt,
      items: order.items.map(item => ({
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
        fitnessBonus: item.fitnessBonus
      })),
      subtotal: totalAmount,
      tax: totalAmount * 0.08, // 8% tax
      shipping: purchaseData.itemType !== 'subscription' ? 9.99 : 0,
      total: totalAmount + (totalAmount * 0.08) + (purchaseData.itemType !== 'subscription' ? 9.99 : 0),
      paymentMethod: purchaseData.paymentMethod,
      estimatedDelivery: order.estimatedDelivery
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        status: order.status,
        estimatedDelivery: order.estimatedDelivery
      },
      receipt,
      fitnessRewards: {
        materialsEarned: bonus.materials ? 
          Object.fromEntries(
            Object.entries(bonus.materials).map(([k, v]) => [k, (v as number) * purchaseData.quantity])
          ) : {},
        xpEarned: bonus.xpBonus ? bonus.xpBonus * purchaseData.quantity : 0,
        subscriptionUpgrade: userUpdates.subscription ? {
          newTier: userUpdates.subscription,
          benefits: bonus
        } : null
      },
      user: updatedUser ? {
        id: updatedUser.id,
        level: updatedUser.level,
        xp: updatedUser.xp,
        subscription: updatedUser.subscription,
        stats: updatedUser.stats
      } : null,
      message: `🎉 Purchase successful! ${product.name} has been added to your forge arsenal! ${bonus.xpBonus ? `+${bonus.xpBonus * purchaseData.quantity} XP earned!` : ''}`
    })

  } catch (error) {
    console.error('Purchase error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Purchase failed' },
      { status: 500 }
    )
  }
}

// GET user's order history
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userOrders = Array.from(orders.values())
      .filter(order => order.userId === user.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return NextResponse.json({
      success: true,
      orders: userOrders.map(order => ({
        id: order.id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery
      })),
      totalSpent: userOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      totalOrders: userOrders.length
    })

  } catch (error) {
    console.error('Order history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order history' },
      { status: 500 }
    )
  }
}

// Simulate payment processing
async function simulatePayment(paymentMethod: string, amount: number): Promise<boolean> {
  // Simulate payment delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // Simulate 95% success rate
  return Math.random() < 0.95
}

// Export product catalog for use in other parts of the app
export { PRODUCT_CATALOG }
