export const dynamic = 'force-dynamic'
import { onAuthenticateUser } from '@/actions/user'
import React from 'react'
import { redirect } from 'next/navigation'

type Props = {
  children: React.ReactNode
}

const Layout = async (props: Props) => {
  const auth = await onAuthenticateUser()
  if (!auth.user) redirect('/sign-in')
  return <div className="w-full mih-h-screen">{props.children}</div>
}

export default Layout
