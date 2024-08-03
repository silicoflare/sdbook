import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from '@/types'

type ResponseData = {
  message: string
} | {
  note: Note
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { id } = req.query
    const session = await getServerAuthSession(req, res)

    if (!id) {
      return res.status(400).json({ message: "Note ID is required" })
    }

    const note = await db.note.findFirst({
      where: {
        noteID: id as string
      },
      include: {
        accessList: {
          select: {
            username: true
          }
        }
      }
    })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    if (note.visibility === 0 || note.visibility === 1) {
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" })
      }
      else if (note.visibility === 0 && session.user.id !== note.creatorID) {
        return res.status(403).json({ message: "Forbidden" })
      }
      else if (note.visibility === 1 && !note.accessList.some(x => x.username === session.user.id)) {
        return res.status(403).json({ message: "Forbidden" })
      }
    }

    const { accessList, ...rest } = note

    res.status(200).json({ note: rest })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
