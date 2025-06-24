'use client'

import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin'
import supabaseDataProvider from '@/lib/supabase-data-provider'
import { UserList, UserEdit, UserShow } from './components/Users'
import { PostList, PostEdit, PostShow } from './components/Posts'
import { 
  Users, 
  FileText, 
  TrendingUp, 
  CreditCard, 
  Activity,
  Settings
} from 'lucide-react'
import { Dashboard } from './components/Dashboard'

const AdminApp = () => (
  <Admin 
    dataProvider={supabaseDataProvider}
    dashboard={Dashboard}
    title="Typify Admin"
  >
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
      icon={Users}
    />
    <Resource
      name="user_posts"
      list={PostList}
      edit={PostEdit}
      show={PostShow}
      icon={FileText}
      options={{ label: 'Posts' }}
    />
    <Resource
      name="usage_logs"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
      icon={Activity}
      options={{ label: 'Usage Logs' }}
    />
    <Resource
      name="subscriptions"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
      icon={CreditCard}
    />
    <Resource
      name="generated_content"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
      icon={TrendingUp}
      options={{ label: 'Generated Content' }}
    />
    <Resource
      name="scheduled_posts"
      list={ListGuesser}
      edit={EditGuesser}
      show={ShowGuesser}
      icon={Settings}
      options={{ label: 'Scheduled Posts' }}
    />
  </Admin>
)

export default AdminApp