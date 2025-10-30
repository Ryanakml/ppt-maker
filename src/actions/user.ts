'use server'

import { currentUser } from '@clerk/nextjs/server'
import { client } from '@/lib/prisma'

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser()
    if (!user) {
      return { status: 403, message: 'User not authenticated' }
    }

    const userInDb = await client.user.upsert({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
      update: {
        profileImage: user.imageUrl,
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        profileImage: user.imageUrl,
      },
      include: {
        purchasedProjects: {
          select: { id: true },
        },
      },
    })

    return {
      status: 200,
      user: userInDb,
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return { status: 500, message: 'Internal server error' }
  }
}
