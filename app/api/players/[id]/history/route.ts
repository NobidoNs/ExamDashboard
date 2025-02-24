import { NextResponse } from 'next/server'
import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function getPlayerInvoices(id:string): Promise<User[] | undefined> {
	const client = createClient()
	await client.connect()
	try {
		const data =
			await client.sql<User>`SELECT name, amount, created FROM invoices WHERE customer_id=${id} ORDER BY created DESC;`
		return data.rows
	} catch (error) {
		console.error('Failed to fetch user:', error)
	} finally {
		await client.end()
	}
}

export async function GET(
    request: Request,
    { params }: { params: Promise <{ id: string }> }
) {
    const id = (await params).id
    const data = await getPlayerInvoices(id) || null

    return new Response(JSON.stringify(data), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
