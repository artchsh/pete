import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { NavProvider } from "@/lib/contexts"
import BottomBar from "@/components/bottom-bar"

export default function PwaLayout() {
	return (
		<NavProvider>
			<Toaster />
			<motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
				<main className={"relative"}>
					<AnimatePresence mode="wait">
						<Outlet />
					</AnimatePresence>
				</main>
			</motion.div>
			<BottomBar />
		</NavProvider>
	)
}
