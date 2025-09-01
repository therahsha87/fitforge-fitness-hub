import { NextRequest, NextResponse } from 'next/server'

interface CorporateInquiry {
  companyName: string
  contactName: string
  email: string
  phone?: string
  employees: number
  industry?: string
  requestType: 'demo' | 'quote' | 'information'
  message?: string
}

interface ROICalculation {
  employees: number
  currentHealthcareCost: number
  estimatedSavings: number
  roiPercentage: number
  paybackMonths: number
  annualProgramCost: number
}

interface CorporatePlan {
  id: string
  name: string
  pricePerUser: number
  minUsers: number
  features: string[]
}

const corporatePlans: CorporatePlan[] = [
  {
    id: 'team-starter',
    name: 'Team Forge Starter',
    pricePerUser: 12,
    minUsers: 10,
    features: ['Full 3D forge access', 'Team challenges', 'Basic analytics']
  },
  {
    id: 'corporate-pro',
    name: 'Corporate Forge Pro', 
    pricePerUser: 18,
    minUsers: 50,
    features: ['Advanced analytics', 'Custom branding', 'Dedicated support']
  },
  {
    id: 'enterprise-master',
    name: 'Enterprise Forge Master',
    pricePerUser: 25,
    minUsers: 500,
    features: ['White-label solution', 'API integration', '24/7 support']
  }
]

// GET - Fetch corporate plans
export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({
      success: true,
      plans: corporatePlans,
      message: 'Corporate plans retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching corporate plans:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch corporate plans' },
      { status: 500 }
    )
  }
}

// POST - Submit corporate inquiry/demo request
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: CorporateInquiry = await request.json()
    const { 
      companyName, 
      contactName, 
      email, 
      phone, 
      employees, 
      industry, 
      requestType,
      message 
    } = body

    // Validate required fields
    if (!companyName || !contactName || !email || !employees) {
      return NextResponse.json(
        { success: false, message: 'Company name, contact name, email, and employee count are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Determine appropriate plan based on employee count
    let recommendedPlan = corporatePlans[0] // Default to starter
    if (employees >= 500) {
      recommendedPlan = corporatePlans[2] // Enterprise
    } else if (employees >= 50) {
      recommendedPlan = corporatePlans[1] // Corporate Pro
    }

    // Generate inquiry ID
    const inquiryId = `corp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification emails to sales team
    // 3. Add to CRM system
    // 4. Schedule follow-up tasks

    // Simulate email notification
    console.log('Corporate inquiry received:', {
      inquiryId,
      companyName,
      contactName,
      email,
      employees,
      recommendedPlan: recommendedPlan.name
    })

    return NextResponse.json({
      success: true,
      inquiryId,
      message: `Thank you ${contactName}! Your ${requestType} request for ${companyName} has been received. Our enterprise team will contact you within 24 hours.`,
      recommendedPlan: recommendedPlan.name,
      estimatedMonthlyCost: employees * recommendedPlan.pricePerUser
    })

  } catch (error) {
    console.error('Error processing corporate inquiry:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process inquiry' },
      { status: 500 }
    )
  }
}

// POST - Calculate ROI (separate endpoint)
export async function calculateROI(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { employees, avgHealthcareCost } = body

    if (!employees || !avgHealthcareCost) {
      return NextResponse.json(
        { success: false, message: 'Employee count and healthcare cost are required' },
        { status: 400 }
      )
    }

    // Industry standard calculations
    const estimatedSavingsRate = 0.28 // 28% average reduction
    const estimatedSavings = avgHealthcareCost * estimatedSavingsRate
    
    // Use Corporate Pro pricing for calculation
    const pricePerUser = 18
    const annualProgramCost = employees * pricePerUser * 12
    
    const netSavings = estimatedSavings - annualProgramCost
    const roiPercentage = (netSavings / annualProgramCost) * 100
    const paybackMonths = Math.max(annualProgramCost / (estimatedSavings / 12), 0)

    const calculation: ROICalculation = {
      employees,
      currentHealthcareCost: avgHealthcareCost,
      estimatedSavings,
      roiPercentage,
      paybackMonths,
      annualProgramCost
    }

    return NextResponse.json({
      success: true,
      calculation,
      message: 'ROI calculation completed successfully'
    })

  } catch (error) {
    console.error('Error calculating ROI:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to calculate ROI' },
      { status: 500 }
    )
  }
}
