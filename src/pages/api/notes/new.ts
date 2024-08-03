import { getServerAuthSession } from '@/server/auth'
import { db } from '@/server/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Note } from '@/types'

type ResponseData = {
  message: string,
  noteID?: string
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

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" })
    }

    const { title, markdown } = req.body

    const note = await db.note.create({
      data: {
        title: title,
        markdown: markdown,
        visibility: 0,
        createdBy: {
          connect: {
            username: session.user.id
          }
        }
      }
    })

    res.status(200).json({ message: "Note created successfully!", noteID: note.noteID })
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
