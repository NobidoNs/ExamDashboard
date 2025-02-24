import { authConfig } from '@/configs/auth'
import { getServerSession } from 'next-auth/next'
import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function getUser(
	email: string | null | undefined
): Promise<User | undefined> {
	const client = createClient()
	await client.connect()
	try {
		const user =
			await client.sql<User>`SELECT * FROM users WHERE email=${email}`
		return user.rows[0]
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user.')
	} finally {
		await client.end()
	}
}

export async function GET(request: Request) {
	let res = null
	try {
		const session = await getServerSession(authConfig)
		const data = await getUser(session?.user?.email)

		res = JSON.stringify(data)
	} catch (error) {
		console.error('Failed to fetch user:', error)
	}

	return new Response(res, {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
