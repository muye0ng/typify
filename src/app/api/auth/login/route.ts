import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
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

export async function POST(request: NextRequest) {
  try {
    const googleUser: GoogleUser = await request.json()

    if (!googleUser.id || !googleUser.email || !googleUser.name) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual database operations
    // For now, we'll simulate database operations
    let user: User

    // Check if user exists (simulate database check)
    const existingUser = await simulateUserLookup(googleUser.email)

    if (existingUser) {
      // Update existing user
      user = {
        ...existingUser,
        name: googleUser.name,
        picture: googleUser.picture,
        updatedAt: new Date()
      }
      await simulateUserUpdate(user)
    } else {
      // Create new user
      user = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        plan: 'free',
        postsUsed: 0,
        postsLimit: 10,
        onboardingCompleted: true, // Skip onboarding for now
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await simulateUserCreate(user)
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      user,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simulated database operations - replace with actual database calls
async function simulateUserLookup(email: string): Promise<User | null> {
  // Simulate database lookup
  const users = JSON.parse(process.env.MOCK_USERS || '[]')
  return users.find((user: User) => user.email === email) || null
}

async function simulateUserCreate(user: User): Promise<void> {
  // Simulate database create
  console.log('Creating user:', user)
  // In real implementation, save to database
}

async function simulateUserUpdate(user: User): Promise<void> {
  // Simulate database update
  console.log('Updating user:', user)
  // In real implementation, update in database
}