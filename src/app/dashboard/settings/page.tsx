'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/lib/auth'
import { 
  User,
  Bell,
  CreditCard,
  Globe,
  Trash2,
  Save,
  AlertTriangle,
  X,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserSettings {
  profile: {
    name: string
    email: string
    avatar?: string
    timezone: string
    language: 'ko' | 'en'
  }
  notifications: {
    email: boolean
    postPublished: boolean
    postFailed: boolean
    weeklyReport: boolean
    monthlyReport: boolean
  }
  social: {
    xConnected: boolean
    threadsConnected: boolean
    xUsername?: string
    threadsUsername?: string
  }
  billing: {
    plan: 'free' | 'basic' | 'pro'
    nextBilling?: string
    paymentMethod?: string
  }
}

export default function SettingsPage() {
  const { t, language, setLanguage, isHydrated } = useLanguage()
  const { user, logout, updateUser } = useAuth()
  
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      timezone: 'Asia/Seoul',
      language: language
    },
    notifications: {
      email: true,
      postPublished: true,
      postFailed: true,
      weeklyReport: false,
      monthlyReport: true
    },
    social: {
      xConnected: false,
      threadsConnected: false
    },
    billing: {
      plan: user?.plan || 'free'
    }
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    if (user) {
      // Update settings from user data
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: user.name,
          email: user.email,
        },
        billing: {
          ...prev.billing,
          plan: user.plan
        }
      }))
      setLoading(false)
    }
  }, [user, language])

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Update user profile using auth context
      if (user) {
        await updateUser({
          name: settings.profile.name,
        })
        
        // Update language context if changed
        if (settings.profile.language !== language) {
          setLanguage(settings.profile.language)
        }
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleConnectSocial = (platform: 'x' | 'threads') => {
    // TODO: Implement social media connection
    console.log(`Connect ${platform}`)
  }

  const handleDisconnectSocial = (platform: 'x' | 'threads') => {
    setSettings(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [`${platform}Connected`]: false,
        [`${platform}Username`]: undefined
      }
    }))
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return
    
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const response = await fetch('/api/dashboard/settings/delete', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (response.ok) {
          logout()
        }
      }
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
  }

  const updateSettings = <K extends keyof UserSettings>(
    section: K,
    updates: Partial<UserSettings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }))
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
                {isHydrated ? t('settings.loading') : 'Loading settings...'}
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
              {isHydrated ? t('settings.title') : 'Settings'}
            </h1>
            <p className="text-foreground-secondary">
              {isHydrated ? t('settings.subtitle') : 'Manage your account preferences'}
            </p>
          </div>
          
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isHydrated ? t('settings.saving') : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isHydrated ? t('settings.save') : 'Save Changes'}
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="card p-4 sticky top-8">
              <nav className="space-y-1">
                <a href="#profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-accent text-white">
                  <User className="w-4 h-4" />
                  {isHydrated ? t('settings.profile') : 'Profile'}
                </a>
                <a href="#notifications" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-hover">
                  <Bell className="w-4 h-4" />
                  {isHydrated ? t('settings.notifications') : 'Notifications'}
                </a>
                <a href="#social" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-hover">
                  <Globe className="w-4 h-4" />
                  {isHydrated ? t('settings.socialAccounts') : 'Social Accounts'}
                </a>
                <a href="#billing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-hover">
                  <CreditCard className="w-4 h-4" />
                  {isHydrated ? t('settings.billing') : 'Billing'}
                </a>
                <a href="#danger" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-hover">
                  <AlertTriangle className="w-4 h-4" />
                  {isHydrated ? t('settings.dangerZone') : 'Danger Zone'}
                </a>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Settings */}
            <motion.div
              id="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                {isHydrated ? t('settings.profileSettings') : 'Profile Settings'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('settings.name') : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => updateSettings('profile', { name: e.target.value })}
                    className="w-full p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('settings.email') : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    disabled
                    className="w-full p-3 bg-surface border border-border rounded-lg opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-foreground-tertiary mt-1">
                    {isHydrated ? t('settings.emailNote') : 'Email cannot be changed after registration'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('settings.language') : 'Language'}
                  </label>
                  <select
                    value={settings.profile.language}
                    onChange={(e) => updateSettings('profile', { language: e.target.value as 'ko' | 'en' })}
                    className="w-full p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="en">English</option>
                    <option value="ko">한국어</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isHydrated ? t('settings.timezone') : 'Timezone'}
                  </label>
                  <select
                    value={settings.profile.timezone}
                    onChange={(e) => updateSettings('profile', { timezone: e.target.value })}
                    className="w-full p-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="Asia/Seoul">{isHydrated ? t('timezone.seoul') : 'Seoul (UTC+9)'}</option>
                    <option value="America/New_York">{isHydrated ? t('timezone.newYork') : 'New York (UTC-5)'}</option>
                    <option value="America/Los_Angeles">{isHydrated ? t('timezone.losAngeles') : 'Los Angeles (UTC-8)'}</option>
                    <option value="Europe/London">{isHydrated ? t('timezone.london') : 'London (UTC+0)'}</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              id="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                {isHydrated ? t('settings.notificationSettings') : 'Notification Settings'}
              </h2>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {isHydrated ? t(`settings.${key}`) : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-foreground-secondary">
                        {isHydrated ? t(`settings.${key}Desc`) : 'Notification description'}
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', { [key]: !value })}
                      className={`w-12 h-6 rounded-full border-2 transition-colors ${
                        value ? 'bg-accent border-accent' : 'bg-surface border-border'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Accounts */}
            <motion.div
              id="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {isHydrated ? t('settings.socialAccountSettings') : 'Social Account Settings'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-blue-500 font-bold">𝕏</span>
                    </div>
                    <div>
                      <div className="font-medium">X (Twitter)</div>
                      <div className="text-sm text-foreground-secondary">
                        {settings.social.xConnected 
                          ? `@${settings.social.xUsername || 'connected'}`
                          : (isHydrated ? t('settings.notConnected') : 'Not connected')
                        }
                      </div>
                    </div>
                  </div>
                  {settings.social.xConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectSocial('x')}
                    >
                      {isHydrated ? t('settings.disconnect') : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnectSocial('x')}
                    >
                      {isHydrated ? t('settings.connect') : 'Connect'}
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-purple-500 font-bold">T</span>
                    </div>
                    <div>
                      <div className="font-medium">Threads</div>
                      <div className="text-sm text-foreground-secondary">
                        {settings.social.threadsConnected 
                          ? `@${settings.social.threadsUsername || 'connected'}`
                          : (isHydrated ? t('settings.notConnected') : 'Not connected')
                        }
                      </div>
                    </div>
                  </div>
                  {settings.social.threadsConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnectSocial('threads')}
                    >
                      {isHydrated ? t('settings.disconnect') : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnectSocial('threads')}
                    >
                      {isHydrated ? t('settings.connect') : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Billing */}
            <motion.div
              id="billing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {isHydrated ? t('settings.billingSettings') : 'Billing Settings'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
                  <div>
                    <div className="font-medium">
                      {isHydrated ? t('settings.currentPlan') : 'Current Plan'}
                    </div>
                    <div className="text-sm text-foreground-secondary capitalize">
                      {settings.billing.plan} plan
                    </div>
                  </div>
                  {settings.billing.plan === 'free' && (
                    <Button onClick={() => window.location.href = '/pricing'}>
                      <Zap className="w-4 h-4 mr-2" />
                      {isHydrated ? t('settings.upgrade') : 'Upgrade'}
                    </Button>
                  )}
                </div>
                
                {settings.billing.nextBilling && (
                  <div className="p-4 bg-surface rounded-lg">
                    <div className="font-medium mb-1">
                      {isHydrated ? t('settings.nextBilling') : 'Next Billing Date'}
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      {new Date(settings.billing.nextBilling).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              id="danger"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 border-red-500/20"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5" />
                {isHydrated ? t('settings.dangerZoneTitle') : 'Danger Zone'}
              </h2>
              
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <div className="font-medium text-red-500 mb-2">
                  {isHydrated ? t('settings.deleteAccount') : 'Delete Account'}
                </div>
                <p className="text-sm text-foreground-secondary mb-4">
                  {isHydrated ? t('settings.deleteAccountWarning') : 'This action cannot be undone. All your data will be permanently deleted.'}
                </p>
                
                {showDeleteConfirm ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-red-500">
                        {isHydrated ? t('common.deleteConfirm') : 'Type "DELETE" to confirm'}
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full p-2 bg-surface border border-red-500/20 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="DELETE"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmText('')
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE'}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isHydrated ? t('settings.deleteAccount') : 'Delete Account'}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}