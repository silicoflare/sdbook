import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from '@/types'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const session = await getServerAuthSession(req, res)

    if (req.method !== "PATCH") {
      return res.status(405).json({ message: "Method not allowed" })
    }

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query
    const { title, markdown } = req.body

    const note = await db.note.findFirst({
      where: {
        noteID: id as string
      }
    })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    if (note.creatorID !== session.user.id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await db.note.update({
      where: {
        noteID: id as string
      },
      data: {
        title,
        markdown
      }
    })

    res.status(200).json({ message: "Note updated successfully!" })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
