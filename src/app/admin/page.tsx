'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const AdminApp = dynamic(
  () => import('./AdminApp').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    ),
  }
)

export default function AdminPage() {
  return <AdminApp />
}