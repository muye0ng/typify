'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'ko'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string) => string
  isHydrated: boolean
}

const translations = {
  en: {
    // Header
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.reviews': 'Reviews',
    'nav.faq': 'FAQ',
    'header.signin': 'Sign In',
    'header.freetrial': 'Free Trial',
    'header.language': 'English',
    
    // Hero Section
    'hero.badge': 'AI-Powered Social Media Management',
    'hero.title1': 'AI Manages Your',
    'hero.title2': 'Social Media',
    'hero.title3': '24/7',
    'hero.subtitle': 'From personal branding to business marketing\nStop worrying about daily social content. Let AI handle it for you.',
    'hero.cta.primary': 'Start Free Trial',
    'hero.cta.secondary': 'Watch Demo',
    'hero.demo.title': 'Product Demo Video',
    'hero.demo.subtitle': 'Coming Soon',
    
    // Pricing
    'pricing.title': 'Affordable Pricing for\nProfessional Social Media Management',
    'pricing.subtitle': 'Try free for 14 days and experience the difference',
    'pricing.basic.name': 'Basic',
    'pricing.basic.description': 'Perfect for individual users',
    'pricing.pro.name': 'Pro',
    'pricing.pro.description': 'Ideal for businesses and influencers',
    'pricing.popular': 'Most Popular',
    'pricing.cta': 'Start 14-Day Free Trial',
    
    // Features
    'features.connect': 'Connect 1 social platform',
    'features.posts.100': '100 posts per month',
    'features.posts.500': '500 posts per month',
    'features.tone.basic': 'Basic tone analysis',
    'features.tone.advanced': 'Advanced tone learning',
    'features.scheduling': 'Scheduled posting',
    'features.scheduling.smart': 'Smart scheduled posting',
    'features.analytics.basic': 'Basic analytics',
    'features.analytics.detailed': 'Detailed analytics & insights',
    'features.support.email': 'Email support',
    'features.support.priority': 'Priority customer support',
    'features.platforms.2': 'Connect 2 social platforms',
    'features.branding': 'Custom branding',
    'features.collaboration': 'Team collaboration',
    'features.api': 'API access',
    
    // Additional pricing
    'pricing.features.title': 'Included Features',
    'pricing.limitations.title': 'Limitations',
    'pricing.guarantee.title': '💰 30-Day Money Back Guarantee',
    'pricing.guarantee.desc': 'If you\'re not satisfied, you can get a full refund anytime',
    'pricing.guarantee.auto': 'Automatic credit card billing',
    'pricing.guarantee.cancel': 'Cancel anytime',
    'pricing.guarantee.hidden': 'No hidden fees',
    
    // Hero Stats
    'hero.stats.users': 'Happy Users',
    'hero.stats.posts': 'Posts Generated',
    'hero.stats.accuracy': 'Style Accuracy',
    
    // Features section
    'features.title': 'Powerful AI Features for\nPerfect Social Media Management',
    'features.subtitle': 'Manage your social media smarter with cutting-edge AI technology',
    
    // Problem section
    'problem.title': 'Daily Social Media Content Creation\nIs Hard, Right?',
    'problem.subtitle': 'Here are the common challenges many face with social media management',
    'problem.daily.title': 'Creating Daily Content is Hard',
    'problem.daily.desc': 'Thinking about and writing social media content every day in a busy life is really difficult.',
    'problem.content.title': 'Don\'t Know What to Write',
    'problem.content.desc': 'Always wondering what content followers would like and what tone to use.',
    'problem.branding.title': 'Consistent Branding is Difficult',
    'problem.branding.desc': 'Creating content while maintaining a consistent personal brand or business image is not easy.',
    'problem.solution.title': 'Stop worrying about these problems!',
    'problem.solution.desc': 'AI-powered Typify learns your unique style and\nautomatically generates content for you every day',
    
    // Solution section
    'solution.title': 'Complete SNS Management\nin Just 3 Steps',
    'solution.subtitle': 'Start easily without complex setup',
    
    // CTA section
    'cta.title': 'Ready to Start?',
    'cta.subtitle': 'Join thousands who\'ve automated their social media',
    'cta.button': 'Start Free Trial',
    
    // FAQ section
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Feel free to contact us if you have any questions',
    'faq.contact.title': 'Have more questions?',
    'faq.contact.desc': 'Contact us anytime. We will respond quickly and kindly.',
    'faq.contact.email': '📧 support@typify.im',
    'faq.contact.chat': '💬 Live Chat',
    'faq.q1': 'Can AI really learn my writing style?',
    'faq.a1': 'Yes, it\'s possible. AI-powered Typify uses advanced natural language processing to analyze your existing posts and learn your tone, style, preferred topics, and hashtag patterns. Usually 20-30 posts are enough for sufficient learning, and it becomes more accurate over time.',
    'faq.q2': 'Which social media platforms do you support?',
    'faq.a2': 'We currently support X (Twitter) and Threads. Basic plan allows you to choose one, while Pro plan lets you connect both platforms simultaneously. We plan to add support for Instagram, LinkedIn and other platforms in the future.',
    'faq.q3': 'What is the quality of generated content?',
    'faq.a3': 'Content is generated by learning your existing writing style, making it very natural. Generated content can be previewed before publishing and edited if needed. Most users report 95%+ satisfaction rate.',
    'faq.q4': 'Is personal information safely protected?',
    'faq.a4': 'Yes, privacy protection is our top priority. All data is encrypted and stored securely, using OAuth 2.0 for safe authentication. Your post data is only used for AI learning purposes and not shared with third parties. We comply with GDPR and privacy protection laws.',
    'faq.q5': 'Are there limitations during the free trial?',
    'faq.a5': 'During the 14-day free trial, you can use all features of your chosen plan without restrictions. Credit card registration is required, but you won\'t be charged if you cancel during the trial period.',
    'faq.q6': 'How fast is content generation?',
    'faq.a6': 'Generating one post usually takes 10-30 seconds. You can generate content in bulk or set up scheduled posting, so you don\'t need to wait in real-time.',
    'faq.q7': 'Can I cancel my subscription anytime?',
    'faq.a7': 'Yes, you can cancel your subscription anytime. After cancellation, you can continue using the service until the end of your current billing cycle. We also offer a 30-day money-back guarantee if you\'re not satisfied with the service.',
    
    // Testimonials section
    'testimonials.title': 'Real Users\'\nTestimonials',
    'testimonials.subtitle': 'Stories from people who experienced transformation in SNS management with AI-powered Typify',
    
    // CTA section
    'cta.badge': 'Start now and get 14 days free',
    'cta.title1': 'Start Today',
    'cta.title2': 'With AI',
    'cta.title3': 'Together',
    'cta.subtitle1': 'Stop worrying about daily SNS content',
    'cta.brandname': 'AI-powered Typify',
    'cta.subtitle2': 'automates everything for you',
    'cta.button': 'Start 14-Day Free Trial',
    'cta.nocard': '✓ No credit card required',
    'cta.cancel': '✓ Cancel anytime',
    'cta.feature1.title': 'Instant Start',
    'cta.feature1.desc': 'Setup complete in 5 minutes\nStart generating content immediately',
    'cta.feature2.title': 'Full Automation',
    'cta.feature2.desc': 'AI automatically generates\nand publishes content 24/7',
    'cta.feature3.title': 'Guaranteed Results',
    'cta.feature3.desc': 'Average 40% engagement boost\n30-day money back guarantee',
    'cta.launch.title': '🎉 Launch Special Offer 🎉',
    'cta.launch.price': 'Regular Price',
    'cta.launch.discount': '(25% off)',
    'cta.launch.limited': '* Launch event limited to first 100 customers',
    'cta.stats.users': '500+ Happy Users',
    'cta.stats.support': '24/7 Customer Support',
    'cta.stats.security': 'Security Certified',
    
    // Footer section
    'footer.description': 'AI-powered social media automation platform that handles your personal branding and business marketing 24/7.',
    'footer.email': 'support@typify.im',
    'footer.chat': 'Live Chat',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.demo': 'Demo',
    'footer.updates': 'Updates',
    'footer.support': 'Support',
    'footer.help': 'Help',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact',
    'footer.status': 'Status',
    'footer.company': 'Company',
    'footer.about': 'About',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.partners': 'Partners',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.refund': 'Refund Policy',
    'footer.copyright': '© 2025 Typify. All rights reserved.',
    
    // Features section
    'features.title': 'Powerful AI Features for\nPerfect Social Media Management',
    'features.subtitle': 'Manage your social media smarter with cutting-edge AI technology',
    'features.card1.title': 'Tone Learning',
    'features.card1.desc': 'AI analyzes your writing style',
    'features.card1.highlight': 'Personal style analysis',
    'features.card2.title': 'Smart Scheduling',
    'features.card2.desc': 'Post at optimal times',
    'features.card2.highlight': 'Engagement optimization',
    'features.card3.title': 'Time Recommendation',
    'features.card3.desc': 'AI suggests best posting times',
    'features.card3.highlight': 'Peak audience hours',
    'features.card4.title': 'Multi-Platform',
    'features.card4.desc': 'Manage X and Threads together',
    'features.card4.highlight': 'Unified management',
    'features.stats.content': 'Generated Content',
    'features.stats.satisfaction': 'User Satisfaction',
    'features.stats.engagement': 'Average Engagement Boost',
    
    // Solution section
    'solution.title': 'Complete SNS Management\nin Just 3 Steps',
    'solution.subtitle': 'Start easily without complex setup',
    'solution.step1.title': 'Connect',
    'solution.step1.desc': 'Link your X or Threads account in one click',
    'solution.step2.title': 'Learn',
    'solution.step2.desc': 'AI analyzes your writing style and preferences',
    'solution.step3.title': 'Auto Post',
    'solution.step3.desc': 'AI generates and posts content automatically',
    'solution.screenshot': 'Step Screenshot',
    'solution.coming': 'Coming Soon',
    'solution.setup.time': 'Average Setup Time: Under 5 minutes',
    'solution.setup.desc': 'Anyone can easily start AI SNS management without complex settings or expertise.',
  },
  ko: {
    // Header
    'nav.features': '기능',
    'nav.pricing': '요금제',
    'nav.reviews': '후기',
    'nav.faq': 'FAQ',
    'header.signin': '로그인',
    'header.freetrial': '무료 체험',
    'header.language': '한국어',
    
    // Hero Section
    'hero.badge': 'AI 기반 소셜미디어 관리',
    'hero.title1': 'AI가 당신의',
    'hero.title2': 'SNS를 24시간',
    'hero.title3': '관리합니다',
    'hero.subtitle': '개인 브랜딩부터 비즈니스 마케팅까지\n매일 SNS 콘텐츠 고민 끝. 이제 AI가 대신 해드립니다.',
    'hero.cta.primary': '무료 체험 시작',
    'hero.cta.secondary': '데모 보기',
    'hero.demo.title': '제품 데모 영상',
    'hero.demo.subtitle': '곧 업데이트 예정',
    
    // Pricing
    'pricing.title': '합리적인 가격으로\n전문적인 SNS 관리',
    'pricing.subtitle': '14일 무료 체험으로 먼저 경험해보세요',
    'pricing.basic.name': 'Basic',
    'pricing.basic.description': '개인 사용자를 위한 기본 플랜',
    'pricing.pro.name': 'Pro',
    'pricing.pro.description': '비즈니스와 인플루언서를 위한 프로 플랜',
    'pricing.popular': '가장 인기',
    'pricing.cta': '14일 무료 체험 시작',
    
    // Features
    'features.connect': '1개 SNS 플랫폼 연결',
    'features.posts.100': '월 100개 게시물 생성',
    'features.posts.500': '월 500개 게시물 생성',
    'features.tone.basic': '기본 톤앤매너 학습',
    'features.tone.advanced': '고급 톤앤매너 학습',
    'features.scheduling': '예약 발행 기능',
    'features.scheduling.smart': '스마트 예약 발행',
    'features.analytics.basic': '기본 분석 리포트',
    'features.analytics.detailed': '상세 분석 및 인사이트',
    'features.support.email': '이메일 고객지원',
    'features.support.priority': '우선 고객지원',
    'features.platforms.2': '2개 SNS 플랫폼 동시 연결',
    'features.branding': '커스텀 브랜딩',
    'features.collaboration': '팀 협업 기능',
    'features.api': 'API 액세스',
    
    // Additional pricing
    'pricing.features.title': '포함된 기능',
    'pricing.limitations.title': '제한사항',
    'pricing.guarantee.title': '💰 30일 환불 보장',
    'pricing.guarantee.desc': '만족하지 않으시면 언제든 100% 환불받으실 수 있습니다',
    'pricing.guarantee.auto': '신용카드 자동결제',
    'pricing.guarantee.cancel': '언제든 취소 가능',
    'pricing.guarantee.hidden': '숨겨진 비용 없음',
    
    // Hero Stats
    'hero.stats.users': '만족한 사용자',
    'hero.stats.posts': '생성된 게시물',
    'hero.stats.accuracy': '스타일 정확도',
    
    // Features section
    'features.title': '강력한 AI 기능으로\n완벽한 SNS 관리',
    'features.subtitle': '첨단 AI 기술로 당신의 SNS를 더 스마트하게 관리하세요',
    
    // Problem section
    'problem.title': '매일 SNS 콘텐츠 만들기\n힘드시죠?',
    'problem.subtitle': '많은 분들이 겪고 있는 SNS 운영의 고민들을 정리해봤습니다',
    'problem.daily.title': '매일 콘텐츠 만들기 힘들어요',
    'problem.daily.desc': '바쁜 일상 속에서 매일 SNS에 올릴 콘텐츠를 생각하고 작성하는 것은 정말 어려운 일입니다.',
    'problem.content.title': '어떤 내용을 써야 할지 모르겠어요',
    'problem.content.desc': '팔로워들이 좋아할 만한 콘텐츠가 무엇인지, 어떤 톤으로 써야 할지 항상 고민됩니다.',
    'problem.branding.title': '일관성 있는 브랜딩이 어려워요',
    'problem.branding.desc': '개인 브랜드나 비즈니스 이미지를 일관되게 유지하면서 콘텐츠를 만드는 것이 쉽지 않습니다.',
    'problem.solution.title': '이런 고민들, 이제 그만하세요!',
    'problem.solution.desc': 'AI 기반의 Typify가 당신만의 스타일을 학습하고\n매일 자동으로 콘텐츠를 생성해드립니다',
    
    // Solution section
    'solution.title': '단 3단계로\nSNS 운영 완료',
    'solution.subtitle': '복잡한 설정 없이 간단하게 시작하세요',
    
    // CTA section
    'cta.title': '시작할 준비가 되셨나요?',
    'cta.subtitle': 'SNS를 자동화한 수천 명의 사용자와 함께하세요',
    'cta.button': '무료 체험 시작',
    
    // FAQ section
    'faq.title': '자주 묻는 질문',
    'faq.subtitle': '궁금한 점이 있으시면 언제든 문의해주세요',
    'faq.contact.title': '더 궁금한 점이 있으신가요?',
    'faq.contact.desc': '언제든지 문의해주세요. 빠르고 친절하게 답변드리겠습니다.',
    'faq.contact.email': '📧 support@typify.im',
    'faq.contact.chat': '💬 실시간 채팅',
    'faq.q1': 'AI가 정말 제 글쓰기 스타일을 학습할 수 있나요?',
    'faq.a1': '네, 가능합니다. AI 기반의 Typify는 고급 자연어 처리 기술을 사용하여 사용자의 기존 게시물을 분석하고, 어투, 문체, 선호하는 주제, 해시태그 사용 패턴 등을 학습합니다. 보통 20-30개의 게시물만 있어도 충분한 학습이 가능하며, 시간이 지날수록 더욱 정확해집니다.',
    'faq.q2': '어떤 SNS 플랫폼을 지원하나요?',
    'faq.a2': '현재 X(트위터)와 Threads를 지원합니다. Basic 플랜에서는 둘 중 하나를 선택할 수 있고, Pro 플랜에서는 두 플랫폼을 동시에 연결하여 사용할 수 있습니다. 향후 인스타그램, 링크드인 등 추가 플랫폼 지원을 계획하고 있습니다.',
    'faq.q3': '생성된 콘텐츠의 품질은 어떤가요?',
    'faq.a3': '사용자의 기존 글쓰기 스타일을 학습하여 매우 자연스러운 콘텐츠를 생성합니다. 또한 생성된 콘텐츠는 발행 전에 미리보기가 가능하며, 필요시 수정할 수 있습니다. 대부분의 사용자들이 95% 이상의 만족도를 보이고 있습니다.',
    'faq.q4': '개인정보는 안전하게 보호되나요?',
    'faq.a4': '네, 개인정보 보호를 최우선으로 합니다. 모든 데이터는 암호화되어 저장되며, OAuth 2.0을 통한 안전한 인증을 사용합니다. 사용자의 게시물 데이터는 AI 학습 목적으로만 사용되며, 제3자와 공유하지 않습니다. GDPR 및 개인정보보호법을 준수합니다.',
    'faq.q5': '무료 체험 기간 중에 제한사항이 있나요?',
    'faq.a5': '14일 무료 체험 기간 동안 선택한 플랜의 모든 기능을 제한 없이 사용하실 수 있습니다. 신용카드 등록이 필요하지만, 체험 기간 중 언제든 취소하면 요금이 청구되지 않습니다.',
    'faq.q6': '콘텐츠 생성 속도는 얼마나 빠른가요?',
    'faq.a6': '하나의 게시물 생성에는 보통 10-30초 정도 소요됩니다. 대량의 콘텐츠를 미리 생성해두거나 예약 발행을 설정할 수 있어, 실시간으로 기다릴 필요가 없습니다.',
    'faq.q7': '언제든지 구독을 취소할 수 있나요?',
    'faq.a7': '네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 현재 결제 주기가 끝날 때까지는 서비스를 계속 이용하실 수 있습니다. 또한 30일 환불 보장 정책으로 서비스에 만족하지 않으시면 전액 환불받으실 수 있습니다.',
    
    // Testimonials section
    'testimonials.title': '실제 사용자들의\n생생한 후기',
    'testimonials.subtitle': 'AI 기반의 Typify로 SNS 운영의 변화를 경험한 분들의 이야기입니다',
    
    // CTA section
    'cta.badge': '지금 시작하면 14일 무료',
    'cta.title1': '오늘부터',
    'cta.title2': 'AI와 함께',
    'cta.title3': '시작하세요',
    'cta.subtitle1': '매일 SNS 콘텐츠 고민하지 마세요',
    'cta.brandname': 'AI 기반의 Typify',
    'cta.subtitle2': '가 모든 것을 자동화해드립니다',
    'cta.button': '14일 무료 체험 시작하기',
    'cta.nocard': '✓ 신용카드 필요 없음',
    'cta.cancel': '✓ 언제든 취소 가능',
    'cta.feature1.title': '즉시 시작',
    'cta.feature1.desc': '5분 만에 설정 완료\n바로 콘텐츠 생성 시작',
    'cta.feature2.title': '완전 자동화',
    'cta.feature2.desc': 'AI가 24시간 자동으로\n콘텐츠 생성 및 발행',
    'cta.feature3.title': '성과 보장',
    'cta.feature3.desc': '평균 40% 참여율 향상\n30일 환불 보장',
    'cta.launch.title': '🎉 런칭 기념 특가 🎉',
    'cta.launch.price': '정가',
    'cta.launch.discount': '(25% 할인)',
    'cta.launch.limited': '* 런칭 이벤트는 선착순 100명 한정입니다',
    'cta.stats.users': '500+ 만족한 사용자',
    'cta.stats.support': '24/7 고객지원',
    'cta.stats.security': '보안 인증 완료',
    
    // Footer section
    'footer.description': 'AI 기반 SNS 자동 관리 플랫폼으로 당신의 개인 브랜딩과 비즈니스 마케팅을 24시간 자동화해드립니다.',
    'footer.email': 'support@typify.im',
    'footer.chat': '실시간 채팅',
    'footer.product': '제품',
    'footer.features': '기능',
    'footer.pricing': '요금제',
    'footer.demo': '데모',
    'footer.updates': '업데이트',
    'footer.support': '지원',
    'footer.help': '도움말',
    'footer.faq': 'FAQ',
    'footer.contact': '문의하기',
    'footer.status': '상태',
    'footer.company': '회사',
    'footer.about': '소개',
    'footer.blog': '블로그',
    'footer.careers': '채용',
    'footer.partners': '파트너',
    'footer.legal': '약관',
    'footer.terms': '이용약관',
    'footer.privacy': '개인정보처리방침',
    'footer.cookies': '쿠키 정책',
    'footer.refund': '환불 정책',
    'footer.copyright': '© 2025 Typify. All rights reserved.',
    
    // Features section
    'features.title': '강력한 AI 기능으로\n완벽한 SNS 관리',
    'features.subtitle': '첨단 AI 기술로 당신의 SNS를 더 스마트하게 관리하세요',
    'features.card1.title': '톤앤매너 학습',
    'features.card1.desc': 'AI가 당신의 글쓰기 스타일을 분석',
    'features.card1.highlight': '개인 맞춤 스타일 분석',
    'features.card2.title': '스마트 예약 발행',
    'features.card2.desc': '최적의 시간에 자동 게시',
    'features.card2.highlight': '참여율 최적화',
    'features.card3.title': '최적 시간 추천',
    'features.card3.desc': 'AI가 최고의 게시 시간을 추천',
    'features.card3.highlight': '피크 타임 분석',
    'features.card4.title': '다중 플랫폼 지원',
    'features.card4.desc': 'X와 Threads를 함께 관리',
    'features.card4.highlight': '통합 관리',
    'features.stats.content': '생성된 콘텐츠',
    'features.stats.satisfaction': '사용자 만족도',
    'features.stats.engagement': '평균 참여율 향상',
    
    // Solution section
    'solution.title': '단 3단계로\nSNS 운영 완료',
    'solution.subtitle': '복잡한 설정 없이 간단하게 시작하세요',
    'solution.step1.title': '연결',
    'solution.step1.desc': 'X 또는 Threads 계정을 원클릭으로 연결',
    'solution.step2.title': '학습',
    'solution.step2.desc': 'AI가 당신의 글쓰기 스타일과 선호도를 분석',
    'solution.step3.title': '자동 게시',
    'solution.step3.desc': 'AI가 자동으로 콘텐츠를 생성하고 게시',
    'solution.screenshot': '단계 스크린샷',
    'solution.coming': '곧 업데이트 예정',
    'solution.setup.time': '평균 설정 시간: 5분 이내',
    'solution.setup.desc': '복잡한 설정이나 전문 지식 없이도 누구나 쉽게 AI SNS 관리를 시작할 수 있습니다.',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // 클라이언트에서만 브라우저 언어 감지
    const browserLang = navigator.language.toLowerCase()
    const detectedLang = browserLang.startsWith('ko') ? 'ko' : 'en'
    setLanguage(detectedLang)
    setIsHydrated(true)
  }, [])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en')
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}