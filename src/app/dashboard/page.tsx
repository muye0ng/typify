'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { useEffect, useState } from 'react'
import { getUser, getUserProfile } from '@/lib/supabase'
import { 
  Sparkles, 
  BarChart3, 
  Calendar,
  Clock,
  TrendingUp,
  ChevronRight,
  Zap,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const { t, isHydrated } = useLanguage()
  const { stats, recentPosts, loading, error } = useDashboardData()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  // Check if user needs to complete onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = await getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const profile = await getUserProfile(user.id)
        if (!profile || !profile.onboarding_completed || !profile.selected_platform) {
          // User hasn't completed onboarding or hasn't selected a platform
          router.push('/dashboard/onboarding')
          return
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setCheckingOnboarding(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  const usagePercentage = (stats.postsUsed / stats.postsLimit) * 100
  const daysUntilReset = Math.ceil((stats.nextReset.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-foreground-secondary">
            {checkingOnboarding 
              ? (isHydrated ? t('dashboard.checkingSetup') : 'Checking setup...') 
              : (isHydrated ? t('dashboard.loading') : 'Loading dashboard...')
            }
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{isHydrated ? t('common.failedToLoad') : 'Failed to load dashboard'}</h2>
          <p className="text-foreground-secondary mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            {isHydrated ? t('common.tryAgain') : 'Try Again'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="noise absolute inset-0" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isHydrated ? t('dashboard.welcome') : 'Welcome back! 👋'}
          </h1>
          <p className="text-foreground-secondary">
            {isHydrated ? t('dashboard.subtitle') : 'Ready to create engaging content for your audience?'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Generate Content Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="card p-6 cursor-pointer border-2 border-transparent hover:border-accent/50 transition-all"
            onClick={() => router.push('/dashboard/generate')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isHydrated ? t('dashboard.generate') : 'Generate New Content'}
            </h3>
            <p className="text-foreground-secondary">
              {isHydrated ? t('dashboard.generate.desc') : 'Create AI-powered posts tailored to your style'}
            </p>
          </motion.div>

          {/* Schedule Posts Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="card p-6 cursor-pointer border-2 border-transparent hover:border-accent/50 transition-all"
            onClick={() => router.push('/dashboard/schedule')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <ChevronRight className="w-5 h-5 text-foreground-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isHydrated ? t('dashboard.schedule') : 'Schedule Posts'}
            </h3>
            <p className="text-foreground-secondary">
              {isHydrated ? t('dashboard.schedule.desc') : 'Plan and automate your content calendar'}
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Usage Stats */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground-secondary">
                {isHydrated ? t('dashboard.monthlyUsage') : 'Monthly Usage'}
              </h3>
              <BarChart3 className="w-4 h-4 text-foreground-tertiary" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-2xl font-bold">{stats.postsUsed}</span>
                  <span className="text-sm text-foreground-secondary">/ {stats.postsLimit}</span>
                </div>
                <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      usagePercentage > 80 ? 'bg-red-500' : 
                      usagePercentage > 60 ? 'bg-yellow-500' : 
                      'bg-accent'
                    }`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
              </div>
              {stats.planType === 'free' && usagePercentage > 70 && (
                <div className="flex items-center gap-2 text-sm text-yellow-500">
                  <AlertCircle className="w-4 h-4" />
                  <span>{isHydrated ? t('dashboard.runningLow') : 'Running low on posts'}</span>
                </div>
              )}
              <p className="text-xs text-foreground-tertiary">
                {isHydrated ? t('dashboard.resetsIn') : 'Resets in'} {daysUntilReset} {isHydrated ? t('dashboard.days') : 'days'}
              </p>
            </div>
          </div>

          {/* This Week */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground-secondary">
                {isHydrated ? t('dashboard.thisWeek') : 'This Week'}
              </h3>
              <Clock className="w-4 h-4 text-foreground-tertiary" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{stats.weeklyPosts}</p>
              <p className="text-sm text-foreground-secondary">
                {isHydrated ? t('dashboard.postsPublished') : 'Posts published'}
              </p>
              {stats.weeklyEngagement > 0 ? (
                <div className="flex items-center gap-1 text-sm text-green-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{stats.weeklyEngagement}% {isHydrated ? t('dashboard.engagement') : 'engagement'}</span>
                </div>
              ) : (
                <p className="text-xs text-foreground-tertiary">
                  {isHydrated ? t('dashboard.noDataYet') : 'No data yet'}
                </p>
              )}
            </div>
          </div>

          {/* Current Plan */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground-secondary">
                {isHydrated ? t('dashboard.currentPlan') : 'Current Plan'}
              </h3>
              <Zap className="w-4 h-4 text-foreground-tertiary" />
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-bold capitalize">{stats.planType}</p>
              {stats.planType === 'free' ? (
                <>
                  <p className="text-sm text-foreground-secondary">{isHydrated ? t('common.postsPerMonth.10') : '10 posts/month'}</p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade
                  </Button>
                </>
              ) : (
                <p className="text-sm text-foreground-secondary">
                  {isHydrated ? (stats.planType === 'basic' ? t('common.postsPerMonth.100') : t('common.postsPerMonth.500')) : (stats.planType === 'basic' ? '100 posts/month' : '500 posts/month')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {isHydrated ? t('dashboard.recentPosts') : 'Recent Posts'}
            </h2>
            <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard/posts')}>
              {isHydrated ? t('dashboard.viewAll') : 'View All'}
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="border border-border rounded-lg p-4 hover:border-border-strong transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.platform === 'x' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {post.platform === 'x' ? 'X' : 'Threads'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        post.status === 'published' ? 'bg-green-500/10 text-green-500' :
                        post.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-500' :
                        post.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <span className="text-xs text-foreground-tertiary">
                      {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                  {post.scheduled_for && post.status === 'scheduled' && (
                    <p className="text-xs text-foreground-secondary mt-2">
                      {isHydrated ? t('common.scheduled') : 'Scheduled for'} {new Date(post.scheduled_for).toLocaleDateString()} {isHydrated ? t('common.at') : 'at'} {new Date(post.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-foreground-tertiary mx-auto mb-4" />
                <p className="text-foreground-secondary">
                  {isHydrated ? t('dashboard.noPosts') : 'No posts yet'}
                </p>
                <p className="text-sm text-foreground-tertiary">
                  {isHydrated ? t('dashboard.createFirst') : 'Create your first post to get started'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {stats.planType === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 card p-6 bg-gradient-to-r from-accent/10 to-accent-secondary/10 border-accent/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {isHydrated ? t('dashboard.upgrade') : 'Unlock More with Basic Plan'}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {isHydrated ? t('dashboard.upgradeDesc') : 'Get 100 posts per month, advanced analytics, and priority support'}
                </p>
              </div>
              <Button onClick={() => router.push('/pricing')}>
                {isHydrated ? t('dashboard.upgradeNow') : 'Upgrade Now'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}