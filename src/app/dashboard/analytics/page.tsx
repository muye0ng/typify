'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { 
  BarChart3,
  TrendingUp,
  Heart,
  Eye,
  Download,
  RefreshCw,
  ArrowUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsData {
  overview: {
    totalPosts: number
    totalEngagement: number
    totalReach: number
    engagementRate: number
  }
  trends: {
    posts: { period: string; count: number }[]
    engagement: { period: string; count: number }[]
    reach: { period: string; count: number }[]
  }
  platforms: {
    x: { posts: number; engagement: number; reach: number }
    threads: { posts: number; engagement: number; reach: number }
  }
  topPosts: {
    id: string
    content: string
    platform: 'x' | 'threads'
    engagement: number
    posted_at: string
  }[]
}

export default function AnalyticsPage() {
  const { t, isHydrated } = useLanguage()
  const { user } = useAuth()
  
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalPosts: 0,
      totalEngagement: 0,
      totalReach: 0,
      engagementRate: 0
    },
    trends: {
      posts: [],
      engagement: [],
      reach: []
    },
    platforms: {
      x: { posts: 0, engagement: 0, reach: 0 },
      threads: { posts: 0, engagement: 0, reach: 0 }
    },
    topPosts: []
  })
  
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await fetch(`/api/dashboard/analytics?range=${timeRange}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          if (response.ok) {
            const analyticsData = await response.json()
            setData(analyticsData)
          }
        } else {
          // Production ready - show empty state
          setData({
            overview: {
              totalPosts: 0,
              totalEngagement: 0,
              totalReach: 0,
              engagementRate: 0
            },
            trends: {
              posts: [],
              engagement: [],
              reach: []
            },
            platforms: {
              x: { posts: 0, engagement: 0, reach: 0 },
              threads: { posts: 0, engagement: 0, reach: 0 }
            },
            topPosts: []
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, timeRange])

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    setRefreshing(false)
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export analytics data')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%'
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? '𝕏' : 'T'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
        <div className="noise absolute inset-0" />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-foreground-secondary">
                {isHydrated ? t('analytics.loading') : 'Loading analytics...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="noise absolute inset-0" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isHydrated ? t('analytics.title') : 'Analytics'}
            </h1>
            <p className="text-foreground-secondary">
              {isHydrated ? t('analytics.subtitle') : 'Track your content performance'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="7d">{isHydrated ? t('analytics.last7Days') : 'Last 7 days'}</option>
              <option value="30d">{isHydrated ? t('analytics.last30Days') : 'Last 30 days'}</option>
              <option value="90d">{isHydrated ? t('analytics.last90Days') : 'Last 90 days'}</option>
            </select>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {isHydrated ? t('analytics.refresh') : 'Refresh'}
            </Button>
            
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              {isHydrated ? t('analytics.export') : 'Export'}
            </Button>
          </div>
        </div>

        {data.overview.totalPosts > 0 ? (
          <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{formatNumber(data.overview.totalPosts)}</div>
                <div className="text-sm text-foreground-secondary">
                  {isHydrated ? t('analytics.totalPosts') : 'Total Posts'}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-500" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{formatNumber(data.overview.totalEngagement)}</div>
                <div className="text-sm text-foreground-secondary">
                  {isHydrated ? t('analytics.totalEngagement') : 'Total Engagement'}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-500" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{formatNumber(data.overview.totalReach)}</div>
                <div className="text-sm text-foreground-secondary">
                  {isHydrated ? t('analytics.totalReach') : 'Total Reach'}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-500" />
                  </div>
                  <ArrowUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mb-1">{formatPercentage(data.overview.engagementRate)}</div>
                <div className="text-sm text-foreground-secondary">
                  {isHydrated ? t('analytics.engagementRate') : 'Engagement Rate'}
                </div>
              </motion.div>
            </div>

            {/* Platform Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {isHydrated ? t('analytics.platformComparison') : 'Platform Comparison'}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 font-bold">𝕏</span>
                      </div>
                      <div>
                        <div className="font-medium">X (Twitter)</div>
                        <div className="text-sm text-foreground-secondary">{data.platforms.x.posts} {isHydrated ? t('common.posts') : 'posts'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatNumber(data.platforms.x.engagement)}</div>
                      <div className="text-sm text-foreground-secondary">{isHydrated ? t('common.engagement') : 'engagement'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                        <span className="text-purple-500 font-bold">T</span>
                      </div>
                      <div>
                        <div className="font-medium">Threads</div>
                        <div className="text-sm text-foreground-secondary">{data.platforms.threads.posts} {isHydrated ? t('common.posts') : 'posts'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatNumber(data.platforms.threads.engagement)}</div>
                      <div className="text-sm text-foreground-secondary">{isHydrated ? t('common.engagement') : 'engagement'}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top Performing Posts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {isHydrated ? t('analytics.topPosts') : 'Top Performing Posts'}
                </h3>
                
                <div className="space-y-3">
                  {data.topPosts.slice(0, 3).map((post, index) => (
                    <div key={post.id} className="p-3 bg-surface rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium">
                            #{index + 1}
                          </span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            post.platform === 'x' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                          }`}>
                            {getPlatformIcon(post.platform)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-sm">{formatNumber(post.engagement)}</div>
                          <div className="text-xs text-foreground-secondary">engagement</div>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                      <div className="text-xs text-foreground-tertiary">
                        {formatDate(post.posted_at)}
                      </div>
                    </div>
                  ))}
                  
                  {data.topPosts.length === 0 && (
                    <div className="text-center py-8 text-foreground-secondary">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {isHydrated ? t('analytics.noTopPosts') : 'No posts data available yet'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Chart Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {isHydrated ? t('analytics.engagementTrends') : 'Engagement Trends'}
              </h3>
              
              <div className="h-64 bg-surface rounded-lg flex items-center justify-center">
                <div className="text-center text-foreground-secondary">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isHydrated ? t('analytics.chartPlaceholder') : 'Interactive charts coming soon'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Empty State */
          <div className="card p-12 text-center">
            <BarChart3 className="w-16 h-16 text-foreground-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isHydrated ? t('analytics.noData') : 'No analytics data yet'}
            </h3>
            <p className="text-foreground-secondary mb-6">
              {isHydrated ? t('analytics.noDataDesc') : 'Start posting content to see your analytics here'}
            </p>
            <Button onClick={() => window.location.href = '/dashboard/generate'}>
              <BarChart3 className="w-4 h-4 mr-2" />
              {isHydrated ? t('analytics.createFirstPost') : 'Create Your First Post'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}