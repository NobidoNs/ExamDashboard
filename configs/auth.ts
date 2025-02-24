import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import type { User } from '@/app/lib/definitions'
import { createClient } from '@vercel/postgres'

async function getUser(email: string): Promise<User | undefined> {
	if (!email) return undefined
	const client = createClient()
	await client.connect()
	try {
		const user =
			await client.sql<User>`SELECT * FROM users WHERE email=${email}`
		return user.rows[0]
	} catch (error) {
		console.error('Failed to fetch user:', error)
	} finally {
		await client.end()
	}
}

async function createUser(
	// input
	email: string,
	password: string,
	name?: string,
	image?: string
): Promise<User> {
	// id
	const { v4: uuidv4 } = require('uuid')
	const id = uuidv4()
	// password
	let hashedPassword = null
	if (password) {
		const salt = await bcrypt.genSalt(10)
		hashedPassword = await bcrypt.hash(password, salt)
	} else {
		hashedPassword = 'supersecret'
	}
	// add to db
	const client = createClient()
	await client.connect()
	try {
		const created = new Date().toISOString()
		const result = await client.sql<User>`
      INSERT INTO users (id, email, password, name, created, image, rank, score)
      VALUES (${id}, ${email}, ${hashedPassword}, ${
			name || null
		}, ${created}, ${image}, ${'-'}, ${0})
      RETURNING *
    `
		return result.rows[0]
		// error
	} catch (error) {
		console.error('Failed to create user:', error)
		throw new Error('Failed to create user.')
	} finally {
		await client.end()
	}
}
const authLocks = new Map<string, boolean>()

export const authConfig: AuthOptions = {
	callbacks: {
		async session({ session, user, token }) {
			const email = session.user?.email
			if (!email) return session

			if (authLocks.get(email)) {
				return session
			}

			authLocks.set(email, true)

			try {
				const userData = await getUser(email)
				if (!userData) {
					await createUser(
						email,
						token.password as string,
						session.user?.name as string,
						session.user?.image as string
					)
				}
				return session
			} finally {
				authLocks.delete(email)
			}
		},
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
}
