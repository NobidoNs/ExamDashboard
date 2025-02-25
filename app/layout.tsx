import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts'
import { Metadata } from 'next'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
	title: {
		template: '%s | Contention',
		default: 'Contention',
	},
	description: 'Соревновательная подготовка к экзаменам',
	metadataBase: new URL('https://contention-nobidon.vercel.app'),
}
export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<Providers>
				<body className={`${inter.className} antialiased`}>{children}</body>
			</Providers>
		</html>
	)
}
