import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { NavProvider } from "@/lib/contexts"
import { useLocation } from "react-router-dom"
import BottomBar from "@/components/bottom-bar"

export default function PwaLayout() {
	const location = useLocation()

	return (
		<NavProvider>
			<Toaster />
			<BottomBar />
			<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
				<main className={`relative ${location.pathname !== "/pwa" ? "h-[calc(100vh-4rem)]" : "h-screen"} w-full max-w-lg bg-background`}>
					<AnimatePresence mode="wait">
						<Outlet />
					</AnimatePresence>
				</main>
			</motion.div>
		</NavProvider>
	)
}
