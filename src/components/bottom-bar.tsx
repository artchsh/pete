/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { Settings, Home, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { main } from '@config'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const pages: string[][] = main.bottomPWABar.pages
const pagesPaths: string[] = pages.map(page => page[1])

export default function BottomBar() {

	// Setups
	const navigate = useNavigate()

	// States
	const [currentPageIndex, setCurrentPageIndex] = React.useState<number>(0)
	const [count, setCount] = React.useState<number>(0)
	const { t } = useTranslation()

	// Functions
	function isActive(index: number, currentIndex: number) {
		return index === currentIndex
	}

	useEffect(() => {
		setCurrentPageIndex(pagesPaths.indexOf(location.pathname))
	}, [count])

	return (
		<header className='fixed bottom-0 left-0 right-0 z-50 bg-background'>
				<Separator />
				<div className="grid grid-cols-3 grid-rows-1">
					{pages.map((page: string[], index: number) => (
						<div key={page[1]} className={cn('rounded-lg', 'p-2 px-3')} onClick={() => { navigate(page[1]); setCount(count + 1) }}>
							<div className={cn(isActive(index, currentPageIndex) && 'bg-primary', 'rounded-md p-2 text-center', 'transition-all ease-in duration-150')}>
								<div className='w-full flex justify-center'>
									{index === 1 && <Home />}
									{index === 0 && <UserRound />}
									{index === 2 && <Settings />}
								</div>
								<p>{t(page[0])}</p>
							</div>
						</div>
					))}
				</div>
		</header>
	)
}