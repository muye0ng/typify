'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { 
  Plus,
  Search,
  FileText,
  ExternalLink,
  MoreHorizontal,
  Eye,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Post {
  id: string
  content: string
  platform: 'x' | 'threads'
  status: 'published' | 'scheduled' | 'draft' | 'failed'
  created_at: string
  scheduled_for?: string
  published_at?: string
  engagement?: {
    likes: number
    reposts: number
    replies: number
  }
}

export default function PostsPage() {
  const { t, isHydrated } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        
        // TODO: Replace with actual API call
        /*
        const token = localStorage.getItem('auth_token')
        const response = await fetch('/api/dashboard/posts', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setPosts(data.posts)
        */
        
        // For now, show empty state
        setPosts([])
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [user])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-500'
      case 'scheduled': return 'bg-yellow-500/10 text-yellow-500'
      case 'draft': return 'bg-gray-500/10 text-gray-500'
      case 'failed': return 'bg-red-500/10 text-red-500'
      default: return 'bg-gray-500/10 text-gray-500'
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? '𝕏' : 'T'
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
                {isHydrated ? t('posts.loading') : 'Loading posts...'}
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
              {isHydrated ? t('posts.title') : 'Your Posts'}
            </h1>
            <p className="text-foreground-secondary">
              {isHydrated ? t('posts.subtitle') : 'Manage and track all your content'}
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/generate')}>
            <Plus className="w-4 h-4 mr-2" />
            {isHydrated ? t('posts.createNew') : 'Create New Post'}
          </Button>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-tertiary" />
              <input
                type="text"
                placeholder={isHydrated ? t('posts.searchPlaceholder') : 'Search posts...'}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{isHydrated ? t('posts.filterAll') : 'All Status'}</option>
                <option value="published">{isHydrated ? t('posts.filterPublished') : 'Published'}</option>
                <option value="scheduled">{isHydrated ? t('posts.filterScheduled') : 'Scheduled'}</option>
                <option value="draft">{isHydrated ? t('posts.filterDraft') : 'Draft'}</option>
                <option value="failed">{isHydrated ? t('posts.filterFailed') : 'Failed'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-foreground-tertiary">
                      {formatDate(post.created_at)}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-foreground mb-4 line-clamp-3">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                    {post.engagement && (
                      <>
                        <span>❤️ {post.engagement.likes}</span>
                        <span>🔄 {post.engagement.reposts}</span>
                        <span>💬 {post.engagement.replies}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <FileText className="w-16 h-16 text-foreground-tertiary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isHydrated ? t('posts.noPosts') : 'No posts yet'}
            </h3>
            <p className="text-foreground-secondary mb-6">
              {isHydrated ? t('posts.noPostsDesc') : 'Create your first post to get started with content generation'}
            </p>
            <Button onClick={() => router.push('/dashboard/generate')}>
              <Plus className="w-4 h-4 mr-2" />
              {isHydrated ? t('posts.createFirst') : 'Create Your First Post'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}