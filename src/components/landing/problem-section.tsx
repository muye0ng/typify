'use client'

import { motion } from 'framer-motion'
import { Clock, Lightbulb, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function ProblemSection() {
  const { t } = useLanguage()

  const problems = [
    {
      icon: Clock,
      title: 'problem.daily.title',
      description: 'problem.daily.desc'
    },
    {
      icon: Lightbulb,
      title: 'problem.content.title',
      description: 'problem.content.desc'
    },
    {
      icon: TrendingDown,
      title: 'problem.branding.title',
      description: 'problem.branding.desc'
    }
  ]

  return (
    <section className="section relative" id="problems">
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
            {t('problem.title').split('\n').map((line, index) => (
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
            {t('problem.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {problems.map((problem, index) => {
            const Icon = problem.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center card-hover"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-secondary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {t(problem.title)}
                </h3>
                <p className="text-foreground-secondary leading-relaxed">
                  {t(problem.description)}
                </p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="card p-12 bg-gradient-to-br from-surface-hover to-surface max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('problem.solution.title')}
            </h3>
            <p className="text-lg md:text-xl text-foreground-secondary leading-relaxed">
              {t('problem.solution.desc').split('\n').map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}