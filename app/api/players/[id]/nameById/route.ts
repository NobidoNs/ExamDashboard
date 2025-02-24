import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function getPlayers(): Promise<User[] | undefined> {
	const client = createClient()
	await client.connect()
	try {
		const data =
			await client.sql<User>`SELECT name, score, rank, id, image FROM users ORDER BY score DESC;`
		return data.rows
	} catch (error) {
		console.error('Failed to fetch user:', error)
	} finally {
		await client.end()
	}
}

export async function GET(request: Request) {
	const data = (await getPlayers()) || null
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
