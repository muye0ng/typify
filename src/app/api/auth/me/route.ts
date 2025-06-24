import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

interface User {
  id: string
  email: string
  name: string
  picture: string
  plan: 'free' | 'basic' | 'pro'
  postsUsed: number
  postsLimit: number
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No valid authorization header' },
        { status: 401 }
      )
    }

    const token = authorization.replace('Bearer ', '')

    try {
      const decoded = jwt.verify(
        token, 
        process.env.JWT_SECRET || 'fallback-secret'
      ) as JWTPayload

      // TODO: Replace with actual database lookup
      const user = await simulateUserLookup(decoded.userId)

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulated database operation - replace with actual database call
async function simulateUserLookup(userId: string): Promise<User | null> {
  // In real implementation, query your database like this:
  /*
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !user) return null
  return user
  */
  
  // For now, return null to indicate user should be fetched from login flow
  // This prevents the John Doe fallback data
  console.log('User lookup for:', userId)
  return null
}