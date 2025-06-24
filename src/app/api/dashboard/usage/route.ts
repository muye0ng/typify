import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface UsageData {
  thisMonth: number
  thisWeek: number
  engagement: number
  nextReset: string
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

    // TODO: Replace with actual database queries
    // For now, return mock data that represents real structure
    const usageData: UsageData = {
      thisMonth: 0, // Count from user_posts where created_at >= start of month
      thisWeek: 0,  // Count from user_posts where created_at >= start of week  
      engagement: 0, // Average engagement from user_posts
      nextReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString()
    }

    /*
    // Actual database implementation would look like this:
    
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    
    const [monthlyPosts, weeklyPosts, engagementData] = await Promise.all([
      supabase
        .from('user_posts')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'published'),
      
      supabase
        .from('user_posts')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startOfWeek.toISOString())
        .eq('status', 'published'),
        
      supabase
        .from('user_posts')
        .select('engagement_metrics')
        .eq('user_id', userId)
        .not('engagement_metrics', 'is', null)
    ])
    
    const avgEngagement = engagementData.data?.length > 0 
      ? engagementData.data.reduce((acc, post) => {
          const metrics = JSON.parse(post.engagement_metrics || '{"engagement": 0}')
          return acc + (metrics.engagement || 0)
        }, 0) / engagementData.data.length
      : 0
    
    usageData.thisMonth = monthlyPosts.data?.length || 0
    usageData.thisWeek = weeklyPosts.data?.length || 0
    usageData.engagement = Math.round(avgEngagement)
    */

    return NextResponse.json(usageData)
  } catch (error) {
    console.error('Usage API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}