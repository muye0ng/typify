'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { getUser, updateUserProfile, getUserProfile } from '@/lib/supabase'
import { 
  Briefcase, 
  Code, 
  Rocket, 
  Palette, 
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Lightbulb,
  Check,
  Twitter,
  MessageCircle
} from 'lucide-react'

interface Industry {
  id: string
  name: string
  icon: any
  description: string
}

interface Tone {
  id: string
  name: string
  icon: any
  description: string
}

interface Topic {
  id: string
  name: string
  selected: boolean
}

interface Platform {
  id: string
  name: string
  icon: any
  description: string
  availableFor: string[]
}

export default function OnboardingPage() {
  const { t, isHydrated } = useLanguage()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedTone, setSelectedTone] = useState<string>('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const user = await getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const profile = await getUserProfile(user.id)
        if (profile && profile.onboarding_completed) {
          // User has already completed onboarding, redirect to dashboard
          router.push('/dashboard')
          return
        }

        // Load existing onboarding data if any
        if (profile) {
          if (profile.selected_industry) setSelectedIndustry(profile.selected_industry)
          if (profile.selected_tone) setSelectedTone(profile.selected_tone)
          if (profile.selected_topics) setSelectedTopics(profile.selected_topics)
          if (profile.selected_platform) setSelectedPlatform(profile.selected_platform)
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkOnboardingStatus()
  }, [router])

  const industries: Industry[] = [
    { id: 'marketer', name: 'Marketer', icon: Briefcase, description: 'Marketing & Growth' },
    { id: 'developer', name: 'Developer', icon: Code, description: 'Tech & Engineering' },
    { id: 'entrepreneur', name: 'Entrepreneur', icon: Rocket, description: 'Startup & Business' },
    { id: 'creator', name: 'Creator', icon: Palette, description: 'Content & Design' },
    { id: 'other', name: 'Other', icon: Users, description: 'General Purpose' }
  ]

  const tones: Tone[] = [
    { id: 'professional', name: isHydrated ? t('common.professional') : 'Professional', icon: Briefcase, description: isHydrated ? t('common.formalAuth') : 'Formal and authoritative' },
    { id: 'friendly', name: isHydrated ? t('common.friendly') : 'Friendly', icon: MessageSquare, description: isHydrated ? t('tone.friendly.desc') : 'Warm and approachable' },
    { id: 'inspirational', name: isHydrated ? t('common.inspiring') : 'Inspirational', icon: Sparkles, description: isHydrated ? t('tone.inspirational.desc') : 'Motivating and uplifting' },
    { id: 'casual', name: isHydrated ? t('common.casual') : 'Casual', icon: Heart, description: isHydrated ? t('tone.casual.desc') : 'Relaxed and conversational' },
    { id: 'witty', name: isHydrated ? t('tone.witty') : 'Witty', icon: Lightbulb, description: isHydrated ? t('tone.witty.desc') : 'Clever and humorous' }
  ]

  const topicsByIndustry: Record<string, Topic[]> = {
    marketer: [
      { id: 'growth', name: 'Growth Hacking', selected: false },
      { id: 'analytics', name: 'Analytics & Data', selected: false },
      { id: 'social', name: 'Social Media', selected: false },
      { id: 'content', name: 'Content Marketing', selected: false },
      { id: 'seo', name: 'SEO & SEM', selected: false },
      { id: 'branding', name: 'Branding', selected: false }
    ],
    developer: [
      { id: 'webdev', name: 'Web Development', selected: false },
      { id: 'ai', name: 'AI & Machine Learning', selected: false },
      { id: 'opensource', name: 'Open Source', selected: false },
      { id: 'coding', name: 'Coding Tips', selected: false },
      { id: 'devops', name: 'DevOps', selected: false },
      { id: 'tech', name: 'Tech News', selected: false }
    ],
    entrepreneur: [
      { id: 'startup', name: 'Startup Life', selected: false },
      { id: 'leadership', name: 'Leadership', selected: false },
      { id: 'funding', name: 'Funding & Investment', selected: false },
      { id: 'productivity', name: isHydrated ? t('common.productivity') : 'Productivity', selected: false },
      { id: 'networking', name: 'Networking', selected: false },
      { id: 'growth', name: 'Business Growth', selected: false }
    ],
    creator: [
      { id: 'design', name: 'Design Trends', selected: false },
      { id: 'creativity', name: isHydrated ? t('common.creativeProcess') : 'Creative Process', selected: false },
      { id: 'tools', name: 'Tools & Resources', selected: false },
      { id: 'inspiration', name: 'Inspiration', selected: false },
      { id: 'portfolio', name: 'Portfolio & Work', selected: false },
      { id: 'community', name: 'Community', selected: false }
    ],
    other: [
      { id: 'business', name: 'Business', selected: false },
      { id: 'technology', name: 'Technology', selected: false },
      { id: 'lifestyle', name: 'Lifestyle', selected: false },
      { id: 'education', name: 'Education', selected: false },
      { id: 'news', name: 'News & Trends', selected: false },
      { id: 'personal', name: 'Personal Growth', selected: false }
    ]
  }

  const platforms: Platform[] = [
    { 
      id: 'twitter', 
      name: 'X (Twitter)', 
      icon: Twitter, 
      description: isHydrated ? t('common.shareThoughts') : 'Share your thoughts in 280 characters',
      availableFor: ['free', 'basic', 'pro']
    },
    { 
      id: 'threads', 
      name: 'Threads', 
      icon: MessageCircle, 
      description: 'Join the conversation on Meta\'s platform',
      availableFor: ['free', 'basic', 'pro']
    }
  ]

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = async () => {
    try {
      // Get current user
      const user = await getUser()
      if (!user) {
        console.error('No user found')
        return
      }

      // Save onboarding data to database
      const onboardingData = {
        selected_industry: selectedIndustry,
        selected_tone: selectedTone,
        selected_topics: selectedTopics,
        selected_platform: selectedPlatform,
        platform_locked_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        onboarding_completed: true
      }
      
      console.log('Saving onboarding data:', onboardingData)
      
      await updateUserProfile(user.id, onboardingData)
      
      console.log('Onboarding complete - data saved successfully')
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      // Show error to user but still allow them to continue
      router.push('/dashboard')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedIndustry !== ''
      case 2:
        return selectedTone !== ''
      case 3:
        return selectedTopics.length > 0 && selectedTopics.length <= 5
      case 4:
        return selectedPlatform !== ''
      default:
        return false
    }
  }

  const toggleTopic = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId))
    } else if (selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topicId])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
        <div className="noise absolute inset-0" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent-secondary rounded-2xl flex items-center justify-center animate-pulse mb-4">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <p className="text-foreground-secondary">{isHydrated ? t('dashboard.loading') : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background" />
      <div className="noise absolute inset-0" />
      
      <div className="relative z-10 w-full max-w-4xl px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`flex items-center ${num < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? 'bg-accent text-white'
                      : 'bg-surface border-2 border-border text-foreground-secondary'
                  }`}
                >
                  {step > num ? <Check className="w-5 h-5" /> : num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-4 transition-all ${
                      step > num ? 'bg-accent' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            <span className={step >= 1 ? 'text-foreground' : 'text-foreground-secondary'}>
              {isHydrated ? t('onboarding.step1.title').split(' ')[0] : 'Industry'}
            </span>
            <span className={step >= 2 ? 'text-foreground' : 'text-foreground-secondary'}>
              {isHydrated ? t('onboarding.step2.title').split(' ')[0] : 'Tone'}
            </span>
            <span className={step >= 3 ? 'text-foreground' : 'text-foreground-secondary'}>
              {isHydrated ? t('onboarding.step3.title').split(' ')[0] : 'Topics'}
            </span>
            <span className={step >= 4 ? 'text-foreground' : 'text-foreground-secondary'}>
              {isHydrated ? t('onboarding.step4.title').split(' ')[0] : 'Platform'}
            </span>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Industry */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isHydrated ? t('onboarding.step1.title') : 'What\'s your industry?'}
                </h2>
                <p className="text-foreground-secondary">
                  {isHydrated ? t('onboarding.step1.subtitle') : 'We\'ll customize your content based on your field'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industries.map((industry) => {
                  const Icon = industry.icon
                  return (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry.id)}
                      className={`card p-6 text-left transition-all ${
                        selectedIndustry === industry.id
                          ? 'border-accent bg-accent/10'
                          : 'hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedIndustry === industry.id
                            ? 'bg-accent text-white'
                            : 'bg-surface-hover text-foreground-secondary'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {industry.name}
                          </h3>
                          <p className="text-sm text-foreground-secondary">
                            {industry.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Tone */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isHydrated ? t('onboarding.step2.title') : 'Choose your tone'}
                </h2>
                <p className="text-foreground-secondary">
                  {isHydrated ? t('onboarding.step2.subtitle') : 'How would you like to sound on social media?'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tones.map((tone) => {
                  const Icon = tone.icon
                  return (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`card p-6 text-left transition-all ${
                        selectedTone === tone.id
                          ? 'border-accent bg-accent/10'
                          : 'hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedTone === tone.id
                            ? 'bg-accent text-white'
                            : 'bg-surface-hover text-foreground-secondary'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {tone.name}
                          </h3>
                          <p className="text-sm text-foreground-secondary">
                            {tone.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Topics */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isHydrated ? t('onboarding.step3.title') : 'Select your topics'}
                </h2>
                <p className="text-foreground-secondary">
                  {isHydrated ? t('onboarding.step3.subtitle') : 'Choose up to 5 topics you\'d like to post about'}
                </p>
                <p className="text-sm text-accent mt-2">
                  {selectedTopics.length}/5 selected
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {topicsByIndustry[selectedIndustry]?.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    disabled={!selectedTopics.includes(topic.id) && selectedTopics.length >= 5}
                    className={`card px-4 py-3 text-left transition-all ${
                      selectedTopics.includes(topic.id)
                        ? 'border-accent bg-accent/10'
                        : selectedTopics.length >= 5
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        selectedTopics.includes(topic.id)
                          ? 'text-accent'
                          : 'text-foreground'
                      }`}>
                        {topic.name}
                      </span>
                      {selectedTopics.includes(topic.id) && (
                        <Check className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Platform */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isHydrated ? t('onboarding.step4.title') : 'Choose your platform'}
                </h2>
                <p className="text-foreground-secondary">
                  {isHydrated ? t('onboarding.step4.subtitle') : 'Select one platform to get started'}
                </p>
                <p className="text-sm text-foreground-secondary mt-2">
                  {isHydrated ? t('onboarding.step4.lockNote') : 'You can change this after one week'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <button
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`card p-6 text-left transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-accent bg-accent/10'
                          : 'hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedPlatform === platform.id
                            ? 'bg-accent text-white'
                            : 'bg-surface-hover text-foreground-secondary'
                        }`}>
                          {platform.id === 'twitter' ? (
                            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          ) : (
                            <div className="text-lg font-bold">@</div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-foreground-secondary">
                            {platform.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            {isHydrated ? t('onboarding.back') : 'Back'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="min-w-[120px]"
          >
            {step === 4 
              ? (isHydrated ? t('onboarding.complete') : 'Get Started')
              : (isHydrated ? t('onboarding.next') : 'Next')
            }
          </Button>
        </div>
      </div>
    </div>
  )
}