'use client'

import { Sparkles, Mail, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function Footer() {
  const { t } = useLanguage()
  
  const footerLinks = {
    product: {
      title: t('footer.product'),
      links: [
        { name: t('footer.features'), href: '#features' },
        { name: t('footer.pricing'), href: '#pricing' },
        { name: t('footer.demo'), href: '#demo' },
        { name: t('footer.updates'), href: '/updates' },
      ]
    },
    support: {
      title: t('footer.support'),
      links: [
        { name: t('footer.help'), href: '/help' },
        { name: t('footer.faq'), href: '#faq' },
        { name: t('footer.contact'), href: '/contact' },
        { name: t('footer.status'), href: '/status' },
      ]
    },
    company: {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.careers'), href: '/careers' },
        { name: t('footer.partners'), href: '/partners' },
      ]
    },
    legal: {
      title: t('footer.legal'),
      links: [
        { name: t('footer.terms'), href: '/terms' },
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.cookies'), href: '/cookies' },
        { name: t('footer.refund'), href: '/refund' },
      ]
    }
  }
  return (
    <footer className="relative">
      <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Typify</span>
            </div>
            
            <p className="text-foreground-secondary mb-6 max-w-md">
              {t('footer.description')}
            </p>
            
            <div className="flex items-center gap-4">
              <a
                href="mailto:support@typify.im"
                className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">{t('footer.email')}</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{t('footer.chat')}</span>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-foreground-secondary hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <div className="text-center">
            <div className="text-sm text-foreground-secondary">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}