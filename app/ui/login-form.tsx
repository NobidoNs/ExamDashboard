'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function LoginForm() {
	return (
		<div className='flex items-center justify-center min-h-[80vh]'>
			<div className='w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm'>
				<div className='text-center'>
					<h2 className='mt-2 text-3xl font-bold tracking-tight text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-200'>
						Welcome
					</h2>
					<p className='mt-2 text-sm text-gray-600 animate-fade-in'>
						Please sign in to continue your journey
					</p>
				</div>

				<div className='mt-6 space-y-6 '>
					<button
						onClick={() => signIn('google', { callbackUrl: '/' })}
						className='group relative flex w-full justify-center rounded-lg border-2 border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:scale-102 hover:border-gray-400 focus:outline-none focus:ring-offset-2 shadow-lg transition-all duration-200 hover:shadow-xl'
					>
						<span className='flex items-center'>
							<Image
								src='https://authjs.dev/img/providers/google.svg'
								alt='Google logo'
								width={24}
								height={24}
								className='mr-3 transform group-hover:rotate-12 transition-transform duration-200'
							/>
							Sign in with Google
						</span>
					</button>

					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='bg-white px-4 text-gray-500 hover:text-gray-700 transition-colors duration-200'>
								or continue with email
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
