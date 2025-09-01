import { NextRequest, NextResponse } from 'next/server'

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  features: string[]
  active: boolean
}

interface SubscriptionRequest {
  planId: string
  userId: string
  billingPeriod: 'monthly' | 'yearly'
  paymentMethodId?: string
}

interface SubscriptionResponse {
  success: boolean
  subscriptionId?: string
  message: string
  redirectUrl?: string
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'iron-apprentice',
    name: 'Iron Apprentice',
    price: 0,
    yearlyPrice: 0,
    features: ['Basic forge access', 'Limited AI coaching'],
    active: true
  },
  {
    id: 'steel-forgemaster', 
    name: 'Steel Forgemaster',
    price: 14.99,
    yearlyPrice: 149.99,
    features: ['Full forge experience', 'Unlimited AI coaching'],
    active: true
  },
  {
    id: 'mythril-champion',
    name: 'Mythril Champion', 
    price: 24.99,
    yearlyPrice: 249.99,
    features: ['Ultimate experience', 'Live coaching'],
    active: true
  }
]

// GET - Fetch subscription plans
export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      plans: subscriptionPlans,
      message: 'Subscription plans retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching subscription plans:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch subscription plans' },
      { status: 500 }
    )
  }
}

// POST - Create/update subscription
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SubscriptionRequest = await request.json()
    const { planId, userId, billingPeriod, paymentMethodId } = body

    // Validate request
    if (!planId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Plan ID and User ID are required' },
        { status: 400 }
      )
    }

    // Find the plan
    const plan = subscriptionPlans.find(p => p.id === planId)
    if (!plan) {
      return NextResponse.json(
        { success: false, message: 'Invalid subscription plan' },
        { status: 400 }
      )
    }

    // Handle free plan
    if (plan.price === 0) {
      // No payment processing needed for free plan
      return NextResponse.json({
        success: true,
        subscriptionId: `sub_free_${Date.now()}`,
        message: `Welcome to ${plan.name}! Your free journey begins now.`
      })
    }

    // For paid plans - integrate with payment processor
    if (!paymentMethodId) {
      // Return checkout URL for payment processing
      const amount = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price
      const checkoutUrl = `/checkout?plan=${planId}&amount=${amount}&period=${billingPeriod}`
      
      return NextResponse.json({
        success: true,
        message: `Redirecting to secure payment for ${plan.name}`,
        redirectUrl: checkoutUrl
      })
    }

    // Simulate payment processing
    const subscriptionId = `sub_${planId}_${Date.now()}`
    
    // Here you would integrate with Stripe, PayPal, etc.
    // const stripeSubscription = await stripe.subscriptions.create({...})

    return NextResponse.json({
      success: true,
      subscriptionId,
      message: `Successfully subscribed to ${plan.name}! Welcome to your enhanced forge experience.`
    })

  } catch (error) {
    console.error('Error processing subscription:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}

// PUT - Update subscription
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { subscriptionId, newPlanId, userId } = body

    if (!subscriptionId || !newPlanId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Subscription ID, new plan ID, and user ID are required' },
        { status: 400 }
      )
    }

    const newPlan = subscriptionPlans.find(p => p.id === newPlanId)
    if (!newPlan) {
      return NextResponse.json(
        { success: false, message: 'Invalid new subscription plan' },
        { status: 400 }
      )
    }

    // Here you would update the subscription with your payment processor
    // await stripe.subscriptions.update(subscriptionId, { items: [...] })

    return NextResponse.json({
      success: true,
      message: `Successfully updated subscription to ${newPlan.name}`
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

// DELETE - Cancel subscription
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('subscriptionId')
    const userId = searchParams.get('userId')

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Subscription ID and User ID are required' },
        { status: 400 }
      )
    }

    // Here you would cancel the subscription with your payment processor
    // await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully. You will retain access until the end of your billing period.'
    })

  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
