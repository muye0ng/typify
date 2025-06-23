'use client'

import { motion } from 'framer-motion'
import { Star, User } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Personal Branding Consultant',
    rating: 5,
    content: 'Thanks to AI-powered Typify, my daily 2-hour social media content creation is now down to just 10 minutes. Plus, my follower engagement increased by 40%!',
    metrics: {
      before: '2 hours daily',
      after: '10 minutes daily',
      improvement: '40% engagement boost'
    }
  },
  {
    name: 'Alex Chen',
    role: 'Startup Marketer',
    rating: 5,
    content: 'Managing startup social media, AI perfectly captures our brand tone and delivers consistent messaging. Extremely satisfied with the results.',
    metrics: {
      before: 'Irregular posting',
      after: 'Daily consistent posts',
      improvement: 'Brand awareness up'
    }
  },
  {
    name: 'Emma Rodriguez',
    role: 'Freelance Designer',
    rating: 5,
    content: 'Managing both X and Threads simultaneously is so convenient. AI automatically creates platform-specific content, saving me tons of time.',
    metrics: {
      before: 'Separate platform mgmt',
      after: 'Unified management',
      improvement: '70% time reduction'
    }
  },
  {
    name: 'Michael Davis',
    role: 'E-commerce CEO',
    rating: 5,
    content: 'Needed social media marketing to boost sales. With AI-powered Typify consistently posting content, store visits have increased noticeably.',
    metrics: {
      before: 'Sporadic promotion',
      after: 'Systematic marketing',
      improvement: '25% more store visits'
    }
  },
  {
    name: 'Lisa Thompson',
    role: 'Yoga Instructor',
    rating: 5,
    content: 'Too busy preparing classes to manage social media. Now AI handles everything automatically, and student engagement is much more active.',
    metrics: {
      before: '5-10 posts/month',
      after: '60 posts/month',
      improvement: '50% more inquiries'
    }
  },
  {
    name: 'David Park',
    role: 'Tech Blogger',
    rating: 5,
    content: 'Consistent posting schedule with AI-generated content that matches my writing style perfectly. Engagement rates improved significantly.',
    metrics: {
      before: 'Inconsistent posting',
      after: 'Daily automation',
      improvement: '60% more engagement'
    }
  },
  {
    name: 'Maria Garcia',
    role: 'Content Creator',
    rating: 5,
    content: 'AI-powered Typify understands my brand voice and creates content that resonates with my audience. Time-saving and effective.',
    metrics: {
      before: '3 hours daily',
      after: '30 minutes daily',
      improvement: '35% follower growth'
    }
  },
  {
    name: 'James Wilson',
    role: 'Small Business Owner',
    rating: 5,
    content: 'Automated social media management allowed me to focus on my business while maintaining strong online presence.',
    metrics: {
      before: 'Manual posting',
      after: 'Full automation',
      improvement: '45% more leads'
    }
  }
]

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="w-80 flex-shrink-0 mx-4">
      <div className="card p-6 h-full bg-surface/50 backdrop-blur-xl border border-border hover:border-border-strong transition-all duration-300">
        {/* User info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-secondary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
            <p className="text-sm text-foreground-secondary">{testimonial.role}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground-secondary mb-6 leading-relaxed text-sm">
          "{testimonial.content}"
        </p>

        {/* Metrics */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-foreground-tertiary">Before:</span>
              <span className="text-foreground-secondary font-medium">{testimonial.metrics.before}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-tertiary">After:</span>
              <span className="text-foreground-secondary font-medium">{testimonial.metrics.after}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-tertiary">Result:</span>
              <span className="text-accent font-semibold">{testimonial.metrics.improvement}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const { t } = useLanguage()
  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  return (
    <section className="section relative overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/2 to-transparent" />
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
            {t('testimonials.title').split('\\n').map((line, index) => (
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
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Infinite scroll marquee */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: '-50%' }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{ width: 'max-content' }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.name}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="card p-8 md:p-12 bg-gradient-to-br from-surface-hover to-surface">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-gradient-accent mb-2">
                  4.9/5
                </div>
                <p className="text-foreground-secondary">Average Satisfaction</p>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-gradient-accent mb-2">
                  500+
                </div>
                <p className="text-foreground-secondary">Happy Users</p>
              </div>
              
              <div>
                <div className="text-4xl md:text-5xl font-bold text-gradient-accent mb-2">
                  98%
                </div>
                <p className="text-foreground-secondary">Retention Rate</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}