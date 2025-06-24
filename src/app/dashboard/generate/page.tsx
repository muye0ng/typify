'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { getUser, getUserProfile } from '@/lib/supabase'
import { 
  Sparkles,
  Zap,
  Calendar,
  Send,
  Loader2,
  MessageSquare,
  Copy,
  RefreshCw,
  Settings,
  Twitter,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GenerationForm {
  topic: string
  tone: 'professional' | 'casual' | 'friendly' | 'humorous' | 'serious' | 'inspiring'
  platform: 'twitter' | 'threads'
  length: 'short' | 'medium' | 'long'
  includeHashtags: boolean
  includeEmojis: boolean
  targetAudience: string
  callToAction: string
  scheduledFor?: string
}

interface GeneratedContent {
  id: string
  content: string
  platform: 'twitter' | 'threads'
  hashtags: string[]
  created_at: string
}

export default function GeneratePage() {
  const { t, isHydrated } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  
  const [form, setForm] = useState<GenerationForm>({
    topic: '',
    tone: 'professional',
    platform: 'twitter',
    length: 'medium',
    includeHashtags: true,
    includeEmojis: false,
    targetAudience: '',
    callToAction: '',
    scheduledFor: ''
  })
  const [initialPlatformSet, setInitialPlatformSet] = useState(false)
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [platformLocked, setPlatformLocked] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Load user profile and platform settings
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const currentUser = await getUser()
        if (!currentUser) {
          setIsLoadingProfile(false)
          return
        }

        const profile = await getUserProfile(currentUser.id)
        if (profile) {
          setUserProfile(profile)
          
          // Set platform from user's selection (only once)
          if (profile.selected_platform && !initialPlatformSet) {
            setForm(prev => ({ ...prev, platform: profile.selected_platform }))
            setInitialPlatformSet(true)
          }
          
          // Check if platform is locked
          if (profile.platform_locked_until) {
            const lockDate = new Date(profile.platform_locked_until)
            const now = new Date()
            setPlatformLocked(now < lockDate)
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserProfile()
  }, [])

  // Check usage limits
  const canGenerate = user && user.postsUsed < user.postsLimit

  const handleInputChange = (field: keyof GenerationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!user || !canGenerate) return
    
    try {
      setIsGenerating(true)
      setError(null)
      
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error(t('common.authRequired'))
      }

      const response = await fetch('/api/dashboard/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t('common.failedToGenerate'))
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      
      // Update user's posts used count
      if (user.updateUser) {
        user.updateUser({ postsUsed: user.postsUsed + 1 })
      }
      
    } catch (err) {
      console.error('Generation failed:', err)
      setError(err instanceof Error ? err.message : t('common.failedToGenerate'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    // Could add a toast notification here
  }

  const handleSchedulePost = (content: GeneratedContent) => {
    // TODO: Implement scheduling functionality
    console.log('Schedule post:', content)
  }

  const handlePublishNow = (content: GeneratedContent) => {
    // TODO: Implement immediate publishing
    console.log('Publish now:', content)
  }

  const getPlatformColor = (platform: string) => {
    return platform === 'x' 
      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
      : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'x' ? '𝕏' : 'T'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background">
      <div className="noise absolute inset-0" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isHydrated ? t('generate.title') : 'Generate Content'}
            </h1>
            <p className="text-foreground-secondary">
              {isHydrated ? t('generate.subtitle') : 'Create engaging social media posts with AI'}
            </p>
          </div>
          
          {/* Usage Counter */}
          <div className="text-right">
            <div className="text-sm text-foreground-secondary mb-1">
              {isHydrated ? t('generate.usageLabel') : 'Usage this month'}
            </div>
            <div className="text-2xl font-bold">
              <span className={user?.postsUsed >= user?.postsLimit ? 'text-red-500' : 'text-accent'}>
                {user?.postsUsed || 0}
              </span>
              <span className="text-foreground-tertiary">/{user?.postsLimit || 10}</span>
            </div>
            {!canGenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/pricing')}
                className="mt-2"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isHydrated ? t('generate.upgrade') : 'Upgrade Plan'}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isHydrated ? t('generate.formTitle') : 'Content Settings'}
              </h2>
              
              <div className="space-y-4">
                {/* Topic */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('generate.topicLabel') : 'Topic'}
                  </label>
                  <textarea
                    value={form.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder={isHydrated ? t('generate.topicPlaceholder') : 'What would you like to post about?'}
                    className="w-full p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    rows={3}
                  />
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('generate.toneLabel') : 'Tone'}
                  </label>
                  <select
                    value={form.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    className="w-full p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="professional">{isHydrated ? t('common.professional') : 'Professional'}</option>
                    <option value="casual">{isHydrated ? t('common.casual') : 'Casual'}</option>
                    <option value="friendly">{isHydrated ? t('common.friendly') : 'Friendly'}</option>
                    <option value="humorous">{isHydrated ? t('common.humorous') : 'Humorous'}</option>
                    <option value="serious">{isHydrated ? t('common.serious') : 'Serious'}</option>
                    <option value="inspiring">{isHydrated ? t('common.inspiring') : 'Inspiring'}</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('generate.platformLabel') : 'Platform'}
                  </label>
                  {isLoadingProfile ? (
                    <div className="p-4 rounded-lg border-2 border-border bg-surface animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-hover rounded"></div>
                        <div>
                          <div className="h-4 bg-surface-hover rounded w-20 mb-1"></div>
                          <div className="h-3 bg-surface-hover rounded w-32"></div>
                        </div>
                      </div>
                    </div>
                  ) : userProfile?.selected_platform ? (
                    <div className="p-4 rounded-lg border-2 border-accent bg-accent/10 flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        {userProfile.selected_platform === 'twitter' && (
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        )}
                        {userProfile.selected_platform === 'threads' && (
                          <div className="text-lg font-bold">@</div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-accent">
                          {userProfile.selected_platform === 'twitter' ? (isHydrated ? t('common.xTwitter') : 'X (Twitter)') : (isHydrated ? t('common.threads') : 'Threads')}
                        </div>
                      </div>
                      <div className="ml-auto text-xs text-foreground-secondary">
                        {platformLocked && userProfile.platform_locked_until && (
                          <>{isHydrated ? t('common.changeAvailable') : 'Change available after'} {new Date(userProfile.platform_locked_until).toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg border-2 border-yellow-500 bg-yellow-500/10 text-yellow-700">
                      <p className="text-sm">{isHydrated ? t('common.pleaseComplete') : 'Please complete onboarding to select your platform.'}</p>
                    </div>
                  )}
                </div>

                {/* Length */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('generate.lengthLabel') : 'Content Length'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'short', name: isHydrated ? t('common.short') : 'Short', description: isHydrated ? t('common.characters.short') : '50-100 characters' },
                      { id: 'medium', name: isHydrated ? t('common.medium') : 'Medium', description: isHydrated ? t('common.characters.medium') : '100-200 characters' },
                      { id: 'long', name: isHydrated ? t('common.long') : 'Long', description: isHydrated ? t('common.characters.long') : '200+ characters' }
                    ].map((length) => (
                      <button
                        key={length.id}
                        onClick={() => handleInputChange('length', length.id)}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          form.length === length.id
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border hover:border-border-strong'
                        }`}
                      >
                        <div className="font-medium">{length.name}</div>
                        <div className="text-xs text-foreground-secondary mt-1">
                          {length.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {isHydrated ? t('generate.includeHashtags') : 'Include Hashtags'}
                    </span>
                    <button
                      onClick={() => handleInputChange('includeHashtags', !form.includeHashtags)}
                      className={`w-12 h-6 rounded-full border-2 transition-colors ${
                        form.includeHashtags
                          ? 'bg-accent border-accent'
                          : 'bg-surface border-border'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        form.includeHashtags ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {isHydrated ? t('generate.includeEmojis') : 'Include Emojis'}
                    </span>
                    <button
                      onClick={() => handleInputChange('includeEmojis', !form.includeEmojis)}
                      className={`w-12 h-6 rounded-full border-2 transition-colors ${
                        form.includeEmojis
                          ? 'bg-accent border-accent'
                          : 'bg-surface border-border'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        form.includeEmojis ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!form.topic.trim() || !canGenerate || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {isHydrated ? t('generate.generating') : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {isHydrated ? t('generate.generateButton') : 'Generate Content'}
                    </>
                  )}
                </Button>

                {!canGenerate && (
                  <p className="text-sm text-red-500 text-center">
                    {isHydrated ? t('generate.limitReached') : 'Monthly limit reached. Upgrade to continue.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="space-y-6">
            {error && (
              <div className="card p-4 border-red-500/20 bg-red-500/5">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {generatedContent.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {isHydrated ? t('generate.generatedTitle') : 'Generated Content'}
                </h2>
                
                {generatedContent.map((content) => (
                  <motion.div
                    key={content.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlatformColor(content.platform)}`}>
                        {getPlatformIcon(content.platform)} {content.platform.toUpperCase()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyContent(content.content)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerate()}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-surface p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-wrap">{content.content}</p>
                    </div>
                    
                    {content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {content.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-accent/10 text-accent px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSchedulePost(content)}
                        className="flex-1"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {isHydrated ? t('generate.schedule') : 'Schedule'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePublishNow(content)}
                        className="flex-1"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isHydrated ? t('generate.publishNow') : 'Publish Now'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <Sparkles className="w-16 h-16 text-foreground-tertiary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {isHydrated ? t('generate.noContentTitle') : 'Ready to Create'}
                </h3>
                <p className="text-foreground-secondary">
                  {isHydrated ? t('generate.noContentDesc') : 'Fill out the form and click Generate to create your content'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}