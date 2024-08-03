import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from '@/types'

type ResponseData = {
  message: string
} | {
  notes: Note[]
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

    const { username } = req.query

    if (session.user.id !== username) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    
    const notes = await db.note.findMany({
      where: {
        creatorID: username
      }
    })

    res.status(200).send({ notes })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
