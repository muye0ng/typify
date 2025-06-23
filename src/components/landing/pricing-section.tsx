'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Crown, Zap, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function PricingSection() {
  const { t } = useLanguage()

  const plans = [
    {
      name: t('pricing.basic.name'),
      price: '$19',
      period: '/month',
      description: t('pricing.basic.description'),
      icon: Zap,
      popular: false,
      features: [
        t('features.connect'),
        t('features.posts.100'),
        t('features.tone.basic'),
        t('features.scheduling'),
        t('features.analytics.basic'),
        t('features.support.email')
      ],
      limitations: [
        'Choose either X (Twitter) or Threads',
        'Limited analytics features',
        'No custom branding'
      ]
    },
    {
      name: t('pricing.pro.name'),
      price: '$39',
      period: '/month',
      description: t('pricing.pro.description'),
      icon: Crown,
      popular: true,
      features: [
        t('features.platforms.2'),
        t('features.posts.500'),
        t('features.tone.advanced'),
        t('features.scheduling.smart'),
        t('features.analytics.detailed'),
        t('features.support.priority'),
        t('features.branding'),
        t('features.collaboration'),
        t('features.api')
      ],
      limitations: []
    }
  ]

  return (
    <section className="section relative" id="pricing">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent" />
      <div className="noise absolute inset-0" />
      
      <div className="container-wide mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('pricing.title').split('\n').map((line, index) => (
              <span key={index} className="block">
                {index === 0 ? (
                  <span className="text-foreground">{line}</span>
                ) : (
                  <span className="text-gradient-accent">{line}</span>
                )}
              </span>
            ))}
          </h2>
          <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group hover:scale-[1.02] transition-transform duration-200"
              >
                {/* Popular badge with enhanced styling */}
                {plan.popular && (
                  <>
                    {/* Glow effect with hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent-secondary to-accent rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    
                    {/* Enhanced popular badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-secondary rounded-full blur opacity-60" />
                        <div className="relative bg-gradient-to-r from-accent to-accent-secondary px-6 py-3 rounded-full flex items-center gap-2">
                          <Star className="w-4 h-4 text-white fill-white" />
                          <span className="text-white font-semibold text-sm tracking-wide">
                            {t('pricing.popular')}
                          </span>
                          <Star className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Card with enhanced styling */}
                <div className={`card p-8 h-full group ${
                  plan.popular 
                    ? 'bg-gradient-to-br from-surface-hover to-surface border-2 border-accent/20 hover:border-accent/30' 
                    : 'bg-surface border border-border hover:border-border-strong'
                } transition-all duration-300`}>
                  
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-accent to-accent-secondary shadow-lg' 
                        : 'bg-surface-hover'
                    }`}>
                      <Icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-accent'}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-foreground-secondary mb-6">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline justify-center mb-4">
                        <span className={`text-5xl font-bold ${
                          plan.popular ? 'text-gradient-accent' : 'text-foreground'
                        }`}>
                          {plan.price}
                        </span>
                        <span className="text-foreground-secondary ml-2">
                          {plan.period}
                        </span>
                      </div>
                      
                      <Button 
                        size="lg"
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-accent to-accent-secondary hover:from-accent/90 hover:to-accent-secondary/90 text-white' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'secondary'}
                      >
                        {t('pricing.cta')}
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      {t('pricing.features.title')}
                    </h4>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-3 text-foreground-secondary"
                        >
                          <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <div className="pt-6 border-t border-border">
                        <h4 className="font-medium text-foreground-tertiary text-sm mb-3">
                          {t('pricing.limitations.title')}
                        </h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li
                              key={limitIndex}
                              className="text-xs text-foreground-tertiary leading-relaxed"
                            >
                              • {limitation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-foreground-tertiary">
            All plans include 14-day free trial • No credit card required • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}