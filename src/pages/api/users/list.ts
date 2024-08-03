import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from '@/types'

type ResponseData = {
  message: string
} | {
  users: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const session = await getServerAuthSession(req, res)

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const userList = await db.user.findMany({
      select: {
        username: true
      }
    })

    res.status(200).send({ users: userList.map(x => x.username) })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
