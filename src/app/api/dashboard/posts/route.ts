import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface PostData {
  id: string
  content: string
  platform: 'x' | 'threads'
  created_at: string
  scheduled_for?: string
  status: 'published' | 'scheduled' | 'draft' | 'failed'
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    const userId = decoded.userId

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    const offset = parseInt(searchParams.get('offset') || '0')

    // TODO: Replace with actual database queries
    // For now, return empty array that represents real structure
    const posts: PostData[] = []

    /*
    // Actual database implementation would look like this:
    
    const { data: posts, error } = await supabase
      .from('user_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)
    
    if (error) {
      throw error
    }
    */

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}