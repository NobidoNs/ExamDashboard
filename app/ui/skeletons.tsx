export const ProfileSkeleton = () => (
	<div className='animate-pulse'>
		<div className='flex flex-col md:flex-row gap-8 items-center md:items-start'>
			<div className='w-[150px] h-[150px] rounded-full bg-gray-200'></div>
			<div className='flex-grow w-full'>
				<div className='h-8 bg-gray-200 rounded w-1/3 mb-4'></div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
					<div className='h-24 bg-gray-200 rounded'></div>
					<div className='h-24 bg-gray-200 rounded'></div>
				</div>
				<div className='space-y-4'>
					<div className='h-10 bg-gray-200 rounded'></div>
					<div className='h-10 bg-gray-200 rounded'></div>
				</div>
			</div>
		</div>
	</div>
)

export const ActivitiesSkeleton = () => (
	<div className='animate-pulse'>
		<div className='space-y-3'>
			{[1, 2, 3, 4, 5].map(i => (
				<div key={i} className='h-12 bg-gray-200 rounded'></div>
			))}
		</div>
	</div>
)
