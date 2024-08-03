import { Inter, Space_Mono } from 'next/font/google'

const itr = Inter({ subsets: ['latin'] })
const sp = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] })

export const inter = itr.className
export const space_mono = sp.className