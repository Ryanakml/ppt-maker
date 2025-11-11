'use server'

import { client } from '@/lib/prisma'
import { onAuthenticateUser } from './user'
import { OutlineCard } from '@/lib/types'

export const getAllProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser()
    if (checkUser.status !== 200 || !checkUser.user) {
      return {
        status: 403,
        message: 'User not authenticated',
      }
    }

    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (projects.length === 0) {
      return {
        status: 404,
        message: 'No projects found',
      }
    }

    return {
      status: 200,
      data: projects,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}

export const getRecentProjects = async (providedUserId?: string) => {
  try {
    let userId = providedUserId
    if (!userId) {
      const checkUser = await onAuthenticateUser()
      if (checkUser.status !== 200 || !checkUser.user) {
        return {
          status: 403,
          message: 'User not authenticated',
        }
      }
      userId = checkUser.user.id
    }

    const recentProjects = await client.project.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 5,
    })

    if (recentProjects.length === 0) {
      return {
        status: 404,
        message: 'No recent projects found',
      }
    }

    return {
      status: 200,
      data: recentProjects,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}

export const recoverProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser()
    if (checkUser.status !== 200 || !checkUser.user) {
      return {
        status: 403,
        message: 'User not authenticated',
      }
    }

    const updatedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: false,
      },
    })

    if (!updatedProject) {
      return {
        status: 500,
        message: 'Failed to recover project',
      }
    }

    return {
      status: 200,
      data: updatedProject,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}

export const deleteProject = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser()
    if (checkUser.status !== 200 || !checkUser.user) {
      return {
        status: 403,
        message: 'User not authenticated',
      }
    }

    const deletedProject = await client.project.update({
      where: {
        id: projectId,
      },
      data: {
        isDeleted: true,
      },
    })

    if (!deletedProject) {
      return {
        status: 500,
        message: 'Failed to delete project',
      }
    }

    return {
      status: 200,
      data: deletedProject,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}

export const createProject = async (title: string, outlines: OutlineCard[]) => {
  try {
    if (!title || !outlines || outlines.length === 0) {
      return {
        status: 400,
        error: 'title and outlines are required',
      }
    }
    const allOutlines = outlines.map((outline) => outline.title)
    const checkUser = await onAuthenticateUser()
    if (checkUser.status !== 200 || !checkUser.user) {
      return {
        status: 403,
        message: 'User not authenticated',
      }
    }

    const project = await client.project.create({
      data: {
        title,
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: checkUser.user.id,
      },
    })

    if (!project) {
      return {
        status: 500,
        message: 'Failed to create project',
      }
    }

    return {
      status: 200,
      data: project,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'Internal server error',
    }
  }
}

export const getProjectById = async (projectId: string) => {
  try {
    const checkUser = await onAuthenticateUser()
    if (checkUser.status !== 200 || !checkUser.user) {
      return {
        status: 403,
        error: 'User not authenticate',
      }
    }

    const project = await client.project.findFirst({
      where: {
        id: projectId,
        userId: checkUser.user.id,
      },
    })

    if (!project) {
      return {
        status: 404,
        error: 'Project not found',
      }
    }

    return {
      status: 200,
      data: project,
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      error: 'Internal server error',
    }
  }
}
