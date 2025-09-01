'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Calculator,
  Mail,
  Phone
} from 'lucide-react'

interface CorporateInquiry {
  companyName: string
  contactName: string
  email: string
  phone: string
  employeeCount: string
  industry: string
}

const CorporateWellness: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('corporate-pro')
  const [employeeCount, setEmployeeCount] = useState<number>(100)
  const [showROI, setShowROI] = useState<boolean>(false)
  const [inquiry, setInquiry] = useState<CorporateInquiry>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    industry: ''
  })

  const corporatePlans = [
    {
      id: 'team-forge-starter',
      name: 'Team Forge Starter',
      price: 12,
      minEmployees: 10,
      maxEmployees: 49,
      description: 'Perfect for growing teams',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      features: [
        'Team Analytics Dashboard',
        'Basic Fitness Challenges',
        'Group Leaderboards', 
        'Email Support',
        'Basic Reporting'
      ]
    },
    {
      id: 'corporate-pro',
      name: 'Corporate Forge Pro',
      price: 18,
      minEmployees: 50,
      maxEmployees: 499,
      description: 'Most popular enterprise solution',
      icon: <Building2 className="w-8 h-8 text-green-500" />,
      badge: 'Most Popular',
      popular: true,
      features: [
        'Advanced Analytics & Insights',
        'Custom Fitness Programs',
        'Wellness Campaign Management',
        'Dedicated Success Manager',
        'Advanced Reporting',
        'API Access'
      ]
    },
    {
      id: 'enterprise-master',
      name: 'Enterprise Forge Master',
      price: 25,
      minEmployees: 500,
      maxEmployees: 999999,
      description: 'Complete enterprise wellness platform',
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      badge: 'Enterprise',
      features: [
        'White-label Solutions',
        'Custom Integrations (HRIS/SSO)',
        'Real-time Health Analytics',
        'Personal Wellness Consultants',
        'Custom Development',
        'Priority Support & SLA'
      ]
    }
  ]

  const calculateROI = (): { savings: number; roi: number; payback: number } => {
    const averageHealthcareCost = 12500 // per employee annually
    const wellnessReduction = 0.24 // 24% average reduction
    const annualSavings = employeeCount * averageHealthcareCost * wellnessReduction
    const annualCost = employeeCount * (selectedPlan ? plans.find(p => p.id === selectedPlan)?.price || 18 : 18) * 12
    const roi = ((annualSavings - annualCost) / annualCost) * 100
    const paybackMonths = annualCost / (annualSavings / 12)
    
    return {
      savings: Math.round(annualSavings),
      roi: Math.round(roi),
      payback: Math.round(paybackMonths * 10) / 10
    }
  }

  const roiData = calculateROI()

  const handleInquiry = async (): Promise<void> => {
    try {
      const response = await fetch('/api/monetization/corporate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      })

      if (response.ok) {
        alert('🔥 Thank you! Our enterprise team will contact you within 24 hours.')
        setInquiry({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          employeeCount: '',
          industry: ''
        })
      }
    } catch (error) {
      alert('⚠️ Something went wrong. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          🏢 Corporate Wellness Solutions
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Transform your workforce health with gamified fitness experiences
        </p>
      </div>

      {/* ROI Calculator */}
      <Card className="mb-12 border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-blue-600" />
            ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Number of Employees</label>
              <Input
                type="number"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                placeholder="Enter employee count"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Plan Selection</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {corporatePlans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${roiData.savings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Annual Healthcare Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{roiData.roi}%</div>
              <div className="text-sm text-gray-600">Return on Investment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{roiData.payback}</div>
              <div className="text-sm text-gray-600">Months to Payback</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Corporate Plans */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {corporatePlans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl ${
              plan.popular ? 'border-2 border-green-500 scale-105 shadow-lg' : 'border'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="default" className="bg-green-500 text-white px-4 py-1">
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">{plan.icon}</div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {plan.name}
              </CardTitle>
              <p className="text-gray-600 text-sm">{plan.description}</p>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-500">per employee/month</div>
                <div className="text-xs text-gray-400 mt-1">
                  {plan.minEmployees}-{plan.maxEmployees === 999999 ? '∞' : plan.maxEmployees} employees
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-900">{feature}</span>
                </div>
              ))}
              
              <Button
                onClick={() => setSelectedPlan(plan.id)}
                variant={selectedPlan === plan.id ? "default" : "outline"}
                className="w-full mt-6"
              >
                {selectedPlan === plan.id ? 'Selected Plan' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="w-6 h-6 mr-2 text-blue-600" />
            Request Enterprise Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input
                value={inquiry.companyName}
                onChange={(e) => setInquiry({...inquiry, companyName: e.target.value})}
                placeholder="Your Company"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Name</label>
              <Input
                value={inquiry.contactName}
                onChange={(e) => setInquiry({...inquiry, contactName: e.target.value})}
                placeholder="Your Name"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={inquiry.email}
                onChange={(e) => setInquiry({...inquiry, email: e.target.value})}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                value={inquiry.phone}
                onChange={(e) => setInquiry({...inquiry, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Employee Count</label>
              <Input
                value={inquiry.employeeCount}
                onChange={(e) => setInquiry({...inquiry, employeeCount: e.target.value})}
                placeholder="Number of employees"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <Input
                value={inquiry.industry}
                onChange={(e) => setInquiry({...inquiry, industry: e.target.value})}
                placeholder="Technology, Healthcare, etc."
              />
            </div>
          </div>

          <Button onClick={handleInquiry} className="w-full bg-blue-600 hover:bg-blue-700">
            Request Demo & Pricing
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CorporateWellness
