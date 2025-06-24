'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { 
  Calendar,
  Clock,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Pause,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScheduledPost {
  id: string
  content: string
  platform: 'x' | 'threads'
  scheduled_for: string
  status: 'scheduled' | 'paused' | 'failed'
  created_at: string
  hashtags?: string[]
}

export default function SchedulePage() {
  const { t, isHydrated } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await fetch('/api/dashboard/schedule', {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          if (response.ok) {
            const data = await response.json()
            setPosts(data.posts)
          }
        } else {
          // Show empty state for production readiness
          setPosts([])
        }
      } catch (error) {
        console.error('Failed to fetch scheduled posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScheduledPosts()
  }, [user])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-500/10 text-green-500'
      case 'paused': return 'bg-yellow-500/10 text-yellow-500'
      case 'failed': return 'bg-red-500/10 text-red-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? '𝕏' : 'T'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handlePausePost = (postId: string) => {
    // TODO: Implement pause functionality
    console.log('Pause post:', postId)
  }

  const handleResumePost = (postId: string) => {
    // TODO: Implement resume functionality
    console.log('Resume post:', postId)
  }

  const handleEditPost = (postId: string) => {
    // TODO: Navigate to edit page
    router.push(`/dashboard/posts/${postId}/edit`)
  }

  const handleDeletePost = (postId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete post:', postId)
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getPostsForDate = (date: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date)
    return filteredPosts.filter(post => {
      const postDate = new Date(post.scheduled_for)
      return postDate.toDateString() === targetDate.toDateString()
    })
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
                {isHydrated ? t('schedule.loading') : 'Loading schedule...'}
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
              {isHydrated ? t('schedule.title') : 'Content Schedule'}
            </h1>
            <p className="text-foreground-secondary">
              {isHydrated ? t('schedule.subtitle') : 'Manage your scheduled posts'}
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/generate')}>
            <Plus className="w-4 h-4 mr-2" />
            {isHydrated ? t('schedule.scheduleNew') : 'Schedule New Post'}
          </Button>
        </div>

        {/* Controls */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {isHydrated ? t('schedule.calendarView') : 'Calendar'}
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Clock className="w-4 h-4 mr-2" />
                {isHydrated ? t('schedule.listView') : 'List'}
              </Button>
            </div>
            
            {viewMode === 'calendar' && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-lg font-semibold min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
              <input
                type="text"
                placeholder={isHydrated ? t('schedule.searchPlaceholder') : 'Search scheduled posts...'}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{isHydrated ? t('schedule.filterAll') : 'All Status'}</option>
              <option value="scheduled">{isHydrated ? t('schedule.filterScheduled') : 'Scheduled'}</option>
              <option value="paused">{isHydrated ? t('schedule.filterPaused') : 'Paused'}</option>
              <option value="failed">{isHydrated ? t('schedule.filterFailed') : 'Failed'}</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'calendar' ? (
          /* Calendar View */
          <div className="card p-6">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-foreground-secondary">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square p-1" />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
                const date = i + 1
                const postsForDate = getPostsForDate(date)
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toDateString()
                
                return (
                  <div
                    key={date}
                    className={`aspect-square p-1 border border-border rounded-lg ${
                      isToday ? 'bg-accent/10 border-accent' : 'hover:bg-surface-hover'
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-accent' : ''}`}>
                      {date}
                    </div>
                    <div className="space-y-1">
                      {postsForDate.slice(0, 2).map(post => (
                        <div
                          key={post.id}
                          className={`text-xs p-1 rounded text-center ${
                            post.platform === 'x' 
                              ? 'bg-blue-500/20 text-blue-500' 
                              : 'bg-purple-500/20 text-purple-500'
                          }`}
                        >
                          {formatTime(post.scheduled_for)}
                        </div>
                      ))}
                      {postsForDate.length > 2 && (
                        <div className="text-xs text-foreground-tertiary text-center">
                          +{postsForDate.length - 2} {isHydrated ? t('common.more') : 'more'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* List View */
          filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6 hover:border-border-strong transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        post.platform === 'x' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(post.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                      <div className="text-sm text-foreground-secondary">
                        {formatDate(post.scheduled_for)} {isHydrated ? t('common.at') : 'at'} {formatTime(post.scheduled_for)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-foreground mb-4 line-clamp-3">{post.content}</p>
                  
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-accent/10 text-accent px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-foreground-secondary">
                      {isHydrated ? t('common.created') : 'Created'} {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditPost(post.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {post.status === 'scheduled' ? (
                        <Button variant="ghost" size="sm" onClick={() => handlePausePost(post.id)}>
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : post.status === 'paused' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleResumePost(post.id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Calendar className="w-16 h-16 text-foreground-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {isHydrated ? t('schedule.noScheduled') : 'No scheduled posts'}
              </h3>
              <p className="text-foreground-secondary mb-6">
                {isHydrated ? t('schedule.noScheduledDesc') : 'Create and schedule your first post to see it here'}
              </p>
              <Button onClick={() => router.push('/dashboard/generate')}>
                <Plus className="w-4 h-4 mr-2" />
                {isHydrated ? t('schedule.scheduleFirst') : 'Schedule Your First Post'}
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
}