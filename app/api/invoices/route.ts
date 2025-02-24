import { sql } from '@vercel/postgres'
import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function createInvoice(
	customerID: string,
	name: string,
	amount: number
): Promise<User> {
	const { v4: uuidv4 } = require('uuid')
	const id = uuidv4()
	const client = createClient()
	await client.connect()

	try {
		const created = new Date().toISOString()
		const result = await client.sql<User>`
      INSERT INTO invoices (id, customer_id, amount, created, "name")
      VALUES (${id}, ${customerID}, ${amount}, ${created}, ${name})
    `
		await client.sql`UPDATE users SET score = CAST(score AS INTEGER) + ${amount} WHERE id = ${customerID};`
		await client.sql`
            WITH RankedUsers AS (
							SELECT id, ROW_NUMBER() OVER (ORDER BY score DESC) AS rank
							FROM users
            )
            UPDATE users
            SET rank = RankedUsers.rank
            FROM RankedUsers
            WHERE users.id = RankedUsers.id;
        `
		return result.rows[0]
	} catch (error) {
		console.error('Failed to create user:', error)
		throw new Error('Failed to create user.')
	} finally {
		await client.end()
	}
}

export async function POST(request: Request) {
	const body = await request.json()
	const newScore = createInvoice(body['user_id'], body['name'], body['amount'])
	return new Response('Invoice created successfully', { status: 200 })
}
