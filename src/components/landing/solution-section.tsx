'use client'

import { motion } from 'framer-motion'
import { Link2, Brain, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'solution.step1.title',
    description: 'solution.step1.desc',
    details: [
      'solution.step1.detail1',
      'solution.step1.detail2',
      'solution.step1.detail3'
    ]
  },
  {
    number: '02',
    icon: Brain,
    title: 'solution.step2.title',
    description: 'solution.step2.desc',
    details: [
      'solution.step2.detail1',
      'solution.step2.detail2',
      'solution.step2.detail3'
    ]
  },
  {
    number: '03',
    icon: Send,
    title: 'solution.step3.title',
    description: 'solution.step3.desc',
    details: [
      'solution.step3.detail1',
      'solution.step3.detail2',
      'solution.step3.detail3'
    ]
  }
]

export function SolutionSection() {
  const { t, language } = useLanguage()
  return (
    <section className="section-spacing relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20 content-spacing"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
            {t('solution.title').split('\n').map((line, index) => (
              <span key={`title-${language}-${index}`} className="block">
                {index === 0 ? (
                  <span className="gradient-text">{line}</span>
                ) : (
                  <span className="text-foreground">{line}</span>
                )}
              </span>
            ))}
          </h2>
          <p className="text-xl md:text-2xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed">
            {t('solution.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={`step-${language}-${index}`}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20 lg:mb-32 last:mb-0 px-4 lg:px-0 ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <div className="card-modern">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="text-6xl font-bold gradient-text">
                        {step.number}
                      </div>
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold mb-6 text-foreground">
                      {t(step.title)}
                    </h3>
                    
                    <p className="text-xl text-foreground-secondary mb-8 leading-relaxed">
                      {t(step.description)}
                    </p>
                    
                    <ul className="space-y-4">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={`detail-${language}-${detailIndex}`}
                          className="flex items-center gap-4 text-lg text-foreground-secondary"
                        >
                          <div className="w-3 h-3 bg-accent rounded-full flex-shrink-0" />
                          <span>{t(detail)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="card-modern aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-primary rounded-full mx-auto mb-8 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                      <p className="text-xl text-foreground-secondary mb-2">
                        {t(step.title)} {t('solution.screenshot')}
                      </p>
                      <p className="text-base text-foreground-secondary">
                        {t('solution.coming')}
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
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-32"
        >
          <div className="glass-effect rounded-2xl p-16 max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 gradient-text text-center">
              {t('solution.setup.time')}
            </h3>
            <p className="text-xl md:text-2xl text-foreground-secondary leading-relaxed max-w-4xl mx-auto text-center">
              {t('solution.setup.desc')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}