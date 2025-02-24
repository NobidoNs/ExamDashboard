'use client'
import { lusitana } from '@/app/ui/fonts'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ProfileSkeleton, ActivitiesSkeleton } from '@/app/ui/skeletons'
import { signOut } from 'next-auth/react'

// todo limits

interface Activity {
	id: number
	created: string
	name: string
	amount: number
}

export default function ProfilePage() {
	const [session, setSession] = useState(null)
	const [inputText, setInputText] = useState('')
	const [inputValue, setInputValue] = useState('')
	const [activities, setActivities] = useState<Activity[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [isLoadingProfile, setIsLoadingProfile] = useState(true)
	const [isLoadingActivities, setIsLoadingActivities] = useState(true)

	const fetchMe = async (url: string) => {
		setIsLoadingProfile(true)
		const res = await fetch(url)
		const data = await res.json()
		setIsLoadingProfile(false)
		if (data) {
			setSession(data)
		}
		return data
	}

	const fetchActivities = async (page: number) => {
		setIsLoadingActivities(true)
		const res = await fetch(`/api/activities?page=${page}`)
		const data = await res.json()
		setActivities(data.invoices)
		setTotalPages(data.totalPages)
		setIsLoadingActivities(false)
	}

	useEffect(() => {
		const getSession = async () => {
			const data = await fetchMe('/api/me')
			setSession(data)
			if (data) {
				fetchActivities(currentPage)
			}
		}
		getSession()
	}, [currentPage])

	let image = '/icon.png'
	let name = ''
	let email = ''
	let created = ''
	let rank = '-'
	let score = 0

	if (session) {
		image = session['image']
		name = session['name']
		email = session['email']
		created = session['created']
		rank = session['rank']
		score = session['score']
	}

	const handleSignOut = async () => {
		// await fetch('/api/auth/signout', {
		// 	method: 'POST',
		// })
		// window.location.href = '/'
		signOut({ callbackUrl: '/' })
	}
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (session && inputText && inputValue) {
			e.preventDefault()
			// Perform any necessary actions with the inputText and inputValue
			await fetch('/api/invoices', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				body: JSON.stringify({
					user_id: session['id'],
					name: inputText,
					amount: inputValue,
				}),
			})

			setInputText('')
			setInputValue('')
			fetchActivities(currentPage)
			fetchMe('/api/me')
		}
	}

	const handlePageChange = (page: string) => {
		if (page === 'prev') {
			setCurrentPage(currentPage - 1)
		} else if (page === 'next') {
			setCurrentPage(currentPage + 1)
		}
		fetchActivities(currentPage)
	}

	const renderActivities = () => {
		if (!activities) {
			return null
		}

		return activities.map(activity => (
			<tr
				key={activity.id}
				className='hover:bg-purple-50 transition-colors duration-200'
			>
				<td className='p-4 hidden md:table-cell'>
					{new Date(activity.created)
						.toLocaleString('sv-SE', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						})
						.replace(' ', ' ')
						.replace(',', '')}
				</td>
				<td className='p-4 md:hidden'>
					{new Date(activity.created)
						.toLocaleString('sv-SE', {
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							hour12: false,
						})
						.replace(' ', ' ')
						.replace(',', '')}
				</td>
				<td className='p-4 font-medium text-indigo-600'>{activity.name}</td>
				<td className='p-4 text-green-600 font-medium'>+{activity.amount}</td>
			</tr>
		))
	}

	return (
		<main className='flex min-h-screen flex-col py-6 md:p-6'>
			<div className='flex justify-between items-center mb-4 px-4 gap-3'>
				<Link
					href='/'
					className='group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-xl hover:from-violet-700 hover:to-indigo-600 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={2.5}
						stroke='currentColor'
						className='w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
						/>
					</svg>
					<span className='font-semibold tracking-wide'>Back to Home</span>
				</Link>

				<button
					className='group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-xl hover:from-pink-600 hover:to-rose-500 transition-all duration-300 shadow-lg transform hover:-translate-y-0.5'
					onClick={handleSignOut}
				>
					<span className='font-semibold tracking-wide'>Sign Out</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={2.5}
						stroke='currentColor'
						className='w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
						/>
					</svg>
				</button>
			</div>
			<div className='container mx-auto max-w-6xl px-4 sm:px-6'>
				<div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-4 sm:p-8 mt-0 border border-purple-100 max-w-full'>
					{isLoadingProfile ? (
						<>
							<ProfileSkeleton />
							<div className='mt-8 pt-8 border-t border-purple-100'>
								<ActivitiesSkeleton />
							</div>
						</>
					) : (
						<>
							<div className='flex flex-col md:flex-row gap-6 md:items-center justify-center'>
								<div className='flex-shrink-0 w-32 sm:w-40 md:w-[150px] mx-auto md:mx-0'>
									<Image
									src={image}
									width={150}
									height={150}
									className='w-full h-auto rounded-full ring-4 ring-purple-200 shadow-lg'
									alt='Profile picture'
									/>
								</div>

								<div className='flex-grow min-w-0'>
									<h1
										className={`${lusitana.className} text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text`}
									>
										{name}
									</h1>

									<div className='grid grid-cols-2 gap-3 w-full mb-6'>
										<div className='stat-card p-4 sm:p-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-purple-100'>
											<h3 className='text-sm sm:text-base text-indigo-700 font-medium'>
												Rank
											</h3>
											<p className='text-xl sm:text-2xl font-bold text-indigo-700'>
												{rank}
											</p>
										</div>
										<div className='stat-card p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-pink-100'>
											<h3 className='text-sm sm:text-base text-indigo-700 font-medium'>
												Score
											</h3>
											<p className='text-xl sm:text-2xl font-bold text-indigo-700'>
												{score}
											</p>
										</div>
									</div>

									<div className='space-y-2 bg-white/50 rounded-lg py-2 md:space-y-4 md:p-6'>
										<div className='flex gap-4 hover:bg-purple-50 rounded-lg transition-colors duration-200 p-1 md:p-2'>
											<span className='font-medium text-violet-700 md:w-24'>
												Email:
											</span>
											<span>{email}</span>
										</div>

										<div className='flex gap-4 hover:bg-purple-50 rounded-lg transition-colors duration-200 p-1 md:p-2'>
											<span className='font-medium text-violet-700 md:w-24'>
												Joined:
											</span>
											<span>{new Date(created).toLocaleString('ru-RU', {
                                              year: 'numeric',
                                              month: 'numeric',
                                              day: 'numeric',
                                          })}</span>
										</div>
									</div>
								</div>
							</div>
							<div className='mt-4 max-w-full'>
								<form onSubmit={handleSubmit}>
									<div className='flex flex-row gap-3 max-w-full'>
									<input
										type='text'
										className='flex-1 p-3 rounded-lg border border-purple-200 min-w-0'
										placeholder='Enter Task'
										value={inputText}
										onChange={e => setInputText(e.target.value)}
									/>
									<input
										type='number'
										className='p-3 rounded-lg border border-purple-200 w-20'
										placeholder='Points'
										value={inputValue}
										onChange={e => {
										const points = parseInt(e.target.value)
										if (points >= 0 && points <= 100) {
											setInputValue(points.toString() as string)
										} else if (points < 0) {
											setInputValue('0')
										} else if (points > 100) {
											setInputValue('100')
										} else if (isNaN(points)) {
											setInputValue('')
										}
										}}
									/>
									<button
											type='submit'
											className='hidden md:block rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white w-24 hover:from-violet-600 hover:to-indigo-600 transition-colors duration-200 whitespace-nowrap'
										>
											Submit
										</button>
									</div>
									<div className='pt-2'>
										<button
											type='submit'
											className='md:hidden w-full p-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white w-24 hover:from-violet-600 hover:to-indigo-600 transition-colors duration-200 whitespace-nowrap'
										>
											Submit
										</button>
									</div>
								</form>
								</div>
							<div className='mt-8 pt-8 border-t border-purple-100'>
								<h2
									className={`${lusitana.className} text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-transparent bg-clip-text`}
								>
									Recent Activity
								</h2>
								<div className='overflow-x-auto -mx-4 sm:mx-0'>
									<table className='w-full '>
										<thead className='text-left bg-gradient-to-r from-violet-50 to-indigo-50'>
											<tr>
												<th className='p-3 sm:p-4 text-sm sm:text-base text-violet-700'>
													Date
												</th>
												<th className='p-3 sm:p-4 text-sm sm:text-base text-violet-700'>
													Activity
												</th>
												<th className='p-3 sm:p-4 text-sm sm:text-base text-violet-700'>
													Points
												</th>
											</tr>
										</thead>
										{isLoadingActivities ? (
											<tbody>
												<tr>
													<td colSpan={3}>
														<ActivitiesSkeleton />
													</td>
												</tr>
											</tbody>
										) : (
											<tbody>{renderActivities()}</tbody>
										)}
									</table>
								</div>
								{!isLoadingActivities && totalPages > 1 && (
									<div className='relative flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 px-4 sm:px-8'>
										{currentPage > 1 && (
											<button
												className='w-full sm:w-auto p-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 transition-colors duration-200 px-4 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all'
												onClick={() => handlePageChange('prev')}
											>
												Previous
											</button>
										)}
										<span className='text-base sm:text-lg font-semibold text-violet-700 bg-violet-50 rounded-lg px-4 py-2'>
											Page {currentPage} of {totalPages}
										</span>
										{currentPage !== totalPages && (
											<button
												className='w-full sm:w-auto p-3 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 transition-colors duration-200 px-4 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all'
												onClick={() => handlePageChange('next')}
											>
												Next
											</button>
										)}
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</main>
	)
}
