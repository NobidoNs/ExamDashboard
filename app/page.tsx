'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ScoreHistory from './components/ScoreHistory'

interface Player {
	rank: number
	name: string
	score: number
	image: string
	id: string
}

interface ScoreHistory {
	name: string
	amount: string
	created: string
}

export default function Page() {
	const [session, setSession] = useState(null)
	const [players, setPlayers] = useState<Player[]>([])
	const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
	const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([])
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);

	const fetchMe = async (url: string) => {
		const res = await fetch(url)
		if (res.ok) {
			const text = await res.text()
			if (text) {
				return JSON.parse(text)
			}
		}
	}

	const handlePlayerClick = async (id: string) => {
		setSelectedPlayer(id);
		setIsLoadingHistory(true);
		const data = await fetchMe(`/api/players/${id}/history`);
		if (data) {
			setScoreHistory(data);
		}
		setIsLoadingHistory(false);
	}

	useEffect(() => {
		const getSession = async () => {
			const data = await fetchMe('/api/me')
			if (data) {
				setSession(data)
			}
		}

		const getPlayers = async () => {
			const data = await fetchMe('/api/players')
			if (data) {
				setPlayers(data)
			}
		}

		getSession()
		getPlayers()
	}, [])

	let image = '/icon.png'
	if (session) {
		image = session['image']
	}

	const renderPlayers = () => {
		return players.map((player, index) => (
			<tr key={index} className='bg-gray-50'>
				<td className='py-4 text-center text-black font-bold'>{player.rank}</td>
				<td className='py-2 px-4 text-center font-medium'>
					<div className='flex items-center justify-center gap-3'>
						<div
							onClick={() => handlePlayerClick(player.id)}
							className='flex items-center px-2 py-1 gap-2 hover:bg-gray-200 rounded-md cursor-pointer'
						>
							<span className='hidden md:block'>{player.name}</span>
							<span className='md:hidden'>{player.name.split(' ')[0]}</span>
							<div className='w-8 h-auto rounded-full overflow-hidden'>
								<Image
									src={player.image || '/icon.png'}
									width={32}
									height={32}
									alt={`${player.name}'s avatar`}
									className='object-cover'
								/>
							</div>
						</div>
					</div>
				</td>
				<td className='text-center text-blue-600 font-bold'>
					{player.score}
				</td>
			</tr>
		))
	}

	return (
		<main className='flex min-h-screen flex-col p-4'>
			<div className='flex justify-center md:justify-end md:absolute md:top-8 md:right-8 z-10'>
				<Link href='/profile'>
					<div className='w-24 h-24 '>
						<Image
							src={image}
							width={800}
							height={800}
							alt='profile-icon'
							className='w-full h-auto object-cover rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white transform md:hover:scale-110'
						/>
					</div>
				</Link>
			</div>

			<div className='max-w-[800px] mx-auto my-4 md:my-20 p-4 bg-white bg-opacity-30 rounded-xl shadow-md w-full transition-transform duration-300 md:hover:-translate-y-2' >
				<div className='mb-8'>
					<h1 className='text-2xl font-bold text-center text-gray-800'>
						Leaderboard
					</h1>
				</div>

				<div className='overflow-x-auto'>
					<table className='w-full bg-white bg-opacity-90 rounded-lg shadow-lg border-collapse overflow-hidden'>
						<thead>
							<tr className='bg-blue-600 md:bg-gradient-to-r from-blue-600 to-purple-500 text-white'>
								<th className='py-4 text-sm font-bold w-1/4 rounded-tl-lg'>
									Rank
								</th>
								<th className='py-4 text-sm font-bold w-2/4'>Player</th>
								<th className='py-4 text-sm font-bold w-1/4 rounded-tr-lg'>
									Score
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-gray-200'>
							{renderPlayers()}
						</tbody>
					</table>
				</div>
			</div>
			<ScoreHistory
				selectedPlayer={selectedPlayer}
				scoreHistory={scoreHistory}
				onClose={() => setSelectedPlayer(null)}
				isLoading={isLoadingHistory}
			/>
		</main>
	)
}
