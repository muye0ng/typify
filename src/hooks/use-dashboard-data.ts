'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

interface DashboardStats {
  postsUsed: number
  postsLimit: number
  planType: 'free' | 'basic' | 'pro'
  nextReset: Date
  weeklyPosts: number
  weeklyEngagement: number
}

interface DashboardPost {
  id: string
  content: string
  platform: 'x' | 'threads'
  created_at: string
  scheduled_for?: string
  status: 'published' | 'scheduled' | 'draft' | 'failed'
}

export function useDashboardData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    postsUsed: 0,
    postsLimit: 10,
    planType: 'free',
    nextReset: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    weeklyPosts: 0,
    weeklyEngagement: 0
  })
  const [recentPosts, setRecentPosts] = useState<DashboardPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get plan limits
      const planLimits = {
        free: 10,
        basic: 100,
        pro: 500
      }

      // Calculate next reset date (next month)
      const now = new Date()
      const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)

      // Set initial stats based on user data
      setStats({
        postsUsed: user.postsUsed || 0,
        postsLimit: planLimits[user.plan],
        planType: user.plan,
        nextReset,
        weeklyPosts: 0, // Real data from DB
        weeklyEngagement: 0 // Real data from DB
      })

      // Set empty posts array (real data would come from DB)
      setRecentPosts([])

      // Get auth token for API calls
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const [usageResponse, postsResponse] = await Promise.all([
            fetch('/api/dashboard/usage', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('/api/dashboard/posts?limit=5', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ])
          
          if (usageResponse.ok && postsResponse.ok) {
            const usageData = await usageResponse.json()
            const postsData = await postsResponse.json()
            
            setStats(prev => ({
              ...prev,
              postsUsed: usageData.thisMonth,
              weeklyPosts: usageData.thisWeek,
              weeklyEngagement: usageData.engagement,
              nextReset: new Date(usageData.nextReset)
            }))
            
            setRecentPosts(postsData.posts)
          }
        } catch (apiError) {
          console.warn('API calls failed, using fallback data:', apiError)
          // Keep the fallback data we already set
        }
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  return {
    stats,
    recentPosts,
    loading,
    error,
    refetch: fetchDashboardData
  }
}