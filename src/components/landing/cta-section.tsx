'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function CTASection() {
  const { t, language } = useLanguage()
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-foreground-secondary">{t('cta.badge')}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">{t('cta.title1')}</span>
            <br />
            <span className="gradient-text">{t('cta.title2')}</span>
            <br />
            <span className="text-foreground">{t('cta.title3')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-2xl mx-auto"
          >
            {t('cta.subtitle1')}<br />
            <span className="text-accent font-semibold">{t('cta.brandname')}</span>{t('cta.subtitle2')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button size="lg" className="group text-lg px-8 py-4">
              {t('cta.button')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-sm text-foreground-secondary">
              {t('cta.nocard')} &nbsp;&nbsp; {t('cta.cancel')}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
            className="glass-effect rounded-2xl p-8 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {t('cta.feature1.title')}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {t('cta.feature1.desc').split('\n').map((line, index) => (
                    <span key={`feature1-${language}-${index}`}>
                      {line}
                      {index < t('cta.feature1.desc').split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {t('cta.feature2.title')}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {t('cta.feature2.desc').split('\n').map((line, index) => (
                    <span key={`feature2-${language}-${index}`}>
                      {line}
                      {index < t('cta.feature2.desc').split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {t('cta.feature3.title')}
                </h3>
                <p className="text-sm text-foreground-secondary">
                  {t('cta.feature3.desc').split('\n').map((line, index) => (
                    <span key={`feature3-${language}-${index}`}>
                      {line}
                      {index < t('cta.feature3.desc').split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="flex justify-center items-center gap-8 text-sm text-foreground-secondary">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>{t('cta.stats.users')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>{t('cta.stats.support')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span>{t('cta.stats.security')}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-10 transform -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
    </section>
  )
}