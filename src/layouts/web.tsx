import React from "react"
import NavigationBar from "@/components/nav-bar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

export default function WebLayout() {
	return (
		<div className="h-screen">
			<NavigationBar />
			<Toaster />
			<div className="flex justify-center">
				<main className="w-full md:max-w-7xl px-4">
					<Outlet />
				</main>
			</div>
		</div>
	)
}
