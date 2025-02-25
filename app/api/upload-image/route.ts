import { NextResponse } from 'next/server'
import { authConfig } from '@/configs/auth'
import { getServerSession } from 'next-auth/next'
import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function changeImage(
  email: string | null | undefined,
  url: string
): Promise<User | undefined> {
  const client = createClient()
  await client.connect()
  try {
    const updatedUser = await client.sql<User>`
      UPDATE users 
      SET image = ${url} 
      WHERE email = ${email} 
      RETURNING *
    `
    if (updatedUser.rows.length === 0) {
      throw new Error('User not found')
    }
    return updatedUser.rows[0]
  } catch (error) {
    console.error('Database error details:', error)
    throw error
  } finally {
    await client.end()
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image')

    if (!image) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 })
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData
    })

    const imgbbData = await response.json()
    
    if (!imgbbData.data?.display_url) {
      return NextResponse.json({ success: false, message: 'Image upload failed' }, { status: 500 })
    }

    const session = await getServerSession(authConfig)
    const updatedUser = await changeImage(session?.user?.email, imgbbData.data.display_url)

    return NextResponse.json({ 
      success: true, 
      data: updatedUser 
    })

  } catch (error) {
    console.error('Upload process error:', error)
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Image upload failed'
    }, { status: 500 })
  }
}
