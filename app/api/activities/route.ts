import type { User } from '@/app/lib/definitions'
import { getServerSession } from 'next-auth/next'
import { authConfig } from '@/configs/auth'
import { createClient } from '@vercel/postgres'

async function getUserID(email: string): Promise<User | undefined> {
	const client = createClient()
	await client.connect()
	try {
		const userID =
			await client.sql<User>`SELECT id FROM users WHERE email=${email}`

		return userID.rows[0]
	} catch (error) {
		console.error('Failed to fetch user:', error)
		throw new Error('Failed to fetch user.')
	} finally {
		await client.end()
	}
}

async function getUserInvoices(
	customerID: string,
	page: string
): Promise<{ invoices: User[]; totalPages: number }> {
	const client = createClient()
	await client.connect()
	try {
		const offset = (Number(page) - 1) * 5
		const lines = 5

		const userInvoices =
			await client.sql<User>`SELECT * FROM invoices WHERE customer_id = ${customerID} ORDER BY created DESC LIMIT ${lines} OFFSET ${offset};`
		const totalCount = await client.sql<{
			count: string
		}>`SELECT COUNT(*) FROM invoices WHERE customer_id = ${customerID}`
		const count = Number(totalCount.rows[0].count) / lines
		const totalPages = Math.max(1, Math.ceil(count))
		return { invoices: userInvoices.rows, totalPages }
	} catch (error) {
		console.error('Failed to fetch user invoices:', error)
		throw new Error('Failed to fetch user invoices.')
	} finally {
		await client.end()
	}
}
export async function GET(request: Request) {
	const url = new URL(request.url)
	const page = url.searchParams.get('page')

	const session = await getServerSession(authConfig)
	const email = session?.user?.email
	const user = await getUserID(email!)
	if (!user) {
		return new Response('User not found', { status: 404 })
	}
	const userInvoices = await getUserInvoices(user.id, page || '1')

	return new Response(JSON.stringify(userInvoices), { status: 200 })
}
