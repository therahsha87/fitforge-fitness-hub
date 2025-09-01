import { NextRequest, NextResponse } from 'next/server'

interface PurchaseItem {
  id: string
  name: string
  category: 'materials' | 'tools' | 'cosmetics' | 'boosts'
  price: number
  currency: string
  description: string
  forgeBonus: string
  available: boolean
}

interface PurchaseRequest {
  userId: string
  itemId: string
  quantity?: number
  paymentMethodId: string
}

interface PurchaseResponse {
  success: boolean
  purchaseId?: string
  message: string
  forgeRewards?: string[]
}

const purchaseItems: PurchaseItem[] = [
  {
    id: 'dragon-steel-ingot',
    name: 'Dragon Steel Ingot Pack',
    category: 'materials',
    price: 4.99,
    currency: 'USD',
    description: 'Rare forging material that doubles XP gains',
    forgeBonus: 'Double XP for 7 days',
    available: true
  },
  {
    id: 'celestial-crystals',
    name: 'Celestial Crystal Bundle',
    category: 'materials',
    price: 2.99,
    currency: 'USD',
    description: 'Mystical crystals that enhance your forge',
    forgeBonus: '+50% material gathering speed',
    available: true
  },
  {
    id: 'masterwork-hammer',
    name: 'Masterwork Hammer of Power',
    category: 'tools',
    price: 9.99,
    currency: 'USD',
    description: 'A legendary hammer that never misses its mark',
    forgeBonus: 'Perfect crafting success rate',
    available: true
  },
  {
    id: 'flame-aura',
    name: 'Eternal Flame Aura',
    category: 'cosmetics',
    price: 1.99,
    currency: 'USD',
    description: 'Surround your avatar with dancing flames',
    forgeBonus: 'Animated flame effects',
    available: true
  },
  {
    id: 'xp-multiplier',
    name: 'XP Multiplier Pack',
    category: 'boosts',
    price: 1.99,
    currency: 'USD',
    description: 'Triple your experience gains for 3 days',
    forgeBonus: '3x XP for 72 hours',
    available: true
  },
  {
    id: 'ultimate-bundle',
    name: 'Ultimate Forge Bundle',
    category: 'boosts',
    price: 19.99,
    currency: 'USD',
    description: 'Everything you need to become a forge master',
    forgeBonus: 'All premium materials + tools included',
    available: true
  }
]

// GET - Fetch available purchase items
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    let filteredItems = purchaseItems.filter(item => item.available)

    if (category && category !== 'featured') {
      filteredItems = filteredItems.filter(item => item.category === category)
    }

    if (featured === 'true') {
      // Return featured items (higher priced or popular items)
      filteredItems = filteredItems.filter(item => 
        item.price >= 4.99 || item.id === 'ultimate-bundle'
      )
    }

    return NextResponse.json({
      success: true,
      items: filteredItems,
      total: filteredItems.length,
      message: 'Purchase items retrieved successfully'
    })

  } catch (error) {
    console.error('Error fetching purchase items:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchase items' },
      { status: 500 }
    )
  }
}

// POST - Process purchase
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: PurchaseRequest = await request.json()
    const { userId, itemId, quantity = 1, paymentMethodId } = body

    // Validate request
    if (!userId || !itemId || !paymentMethodId) {
      return NextResponse.json(
        { success: false, message: 'User ID, item ID, and payment method are required' },
        { status: 400 }
      )
    }

    // Find the item
    const item = purchaseItems.find(i => i.id === itemId)
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      )
    }

    if (!item.available) {
      return NextResponse.json(
        { success: false, message: 'Item is currently unavailable' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = item.price * quantity

    // Generate purchase ID
    const purchaseId = `purch_${itemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Here you would integrate with payment processor
    // const payment = await stripe.paymentIntents.create({
    //   amount: Math.round(totalAmount * 100), // Convert to cents
    //   currency: item.currency.toLowerCase(),
    //   payment_method: paymentMethodId,
    //   confirm: true,
    //   metadata: { userId, itemId, purchaseId }
    // })

    // Simulate successful payment
    const success = Math.random() > 0.1 // 90% success rate for simulation

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Payment processing failed. Please try again.' },
        { status: 400 }
      )
    }

    // Generate forge rewards based on item type
    const forgeRewards: string[] = [item.forgeBonus]
    
    if (item.category === 'materials') {
      forgeRewards.push('Added to forge inventory')
    } else if (item.category === 'tools') {
      forgeRewards.push('Equipped automatically')
    } else if (item.category === 'cosmetics') {
      forgeRewards.push('Applied to avatar')
    } else if (item.category === 'boosts') {
      forgeRewards.push('Activated immediately')
    }

    // Here you would:
    // 1. Save purchase to database
    // 2. Add items to user's inventory
    // 3. Apply boosts/effects
    // 4. Send confirmation email

    return NextResponse.json({
      success: true,
      purchaseId,
      message: `Successfully purchased ${item.name}! Check your forge inventory.`,
      forgeRewards,
      totalAmount: totalAmount,
      currency: item.currency
    })

  } catch (error) {
    console.error('Error processing purchase:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process purchase' },
      { status: 500 }
    )
  }
}

// GET - Get user's purchase history
export async function getUserPurchases(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Here you would fetch from database
    // const purchases = await db.purchases.findMany({ where: { userId } })

    // Simulate purchase history
    const mockPurchases = [
      {
        id: 'purch_123',
        itemId: 'dragon-steel-ingot',
        itemName: 'Dragon Steel Ingot Pack',
        amount: 4.99,
        currency: 'USD',
        purchaseDate: new Date().toISOString(),
        status: 'completed'
      }
    ]

    return NextResponse.json({
      success: true,
      purchases: mockPurchases,
      message: 'Purchase history retrieved successfully'
    })

  } catch (error) {
    console.error('Error fetching purchase history:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchase history' },
      { status: 500 }
    )
  }
}
