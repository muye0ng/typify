'use client'

import { motion } from 'framer-motion'
import { Brain, Calendar, TrendingUp, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function FeaturesSection() {
  const { t, language } = useLanguage()
  
  const features = [
    {
      icon: Brain,
      title: 'features.card1.title',
      description: 'features.card1.desc',
      highlight: 'features.card1.highlight',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calendar,
      title: 'features.card2.title',
      description: 'features.card2.desc',
      highlight: 'features.card2.highlight',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'features.card3.title',
      description: 'features.card3.desc',
      highlight: 'features.card3.highlight',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'features.card4.title',
      description: 'features.card4.desc',
      highlight: 'features.card4.highlight',
      gradient: 'from-orange-500 to-red-500'
    }
  ]
  return (
    <section className="section-spacing relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 content-spacing"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            {t('features.title').split('\n').map((line, index) => (
              <span key={`title-${language}-${index}`} className="block">
                {index === 0 ? (
                  <span className="text-foreground">{line}</span>
                ) : (
                  <span className="gradient-text">{line}</span>
                )}
              </span>
            ))}
          </h2>
          <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-7xl mx-auto mb-20 px-4 md:px-0">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={`feature-${language}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern group hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-8 mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-foreground">
                        {t(feature.title)}
                      </h3>
                      <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
                        {t(feature.highlight)}
                      </span>
                    </div>
                    
                    <p className="text-lg text-foreground-secondary leading-relaxed">
                      {t(feature.description)}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <div className="aspect-video bg-background-secondary rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Icon className="w-16 h-16 text-foreground-secondary mx-auto mb-4" />
                      <p className="text-base text-foreground-secondary">
                        {t(feature.title)} Preview
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <div className="glass-effect rounded-2xl p-16 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-6">
                  10,000+
                </div>
                <p className="text-lg md:text-xl text-foreground-secondary">
                  {t('features.stats.content')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-6">
                  95%
                </div>
                <p className="text-lg md:text-xl text-foreground-secondary">
                  {t('features.stats.satisfaction')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-6">
                  40%
                </div>
                <p className="text-lg md:text-xl text-foreground-secondary">
                  {t('features.stats.engagement')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}