import React from "react"
import { useNavigate } from "react-router-dom"
import { main } from "@config"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export default function NavigationBar() {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()

	// Functions
	function isActive(page: string): boolean {
		return page === window.location.pathname
	}

	return (
		<header className="fixed top-0 flex h-16 w-screen justify-center border-b bg-card" style={{ zIndex: 9999 }}>
			<div className="flex h-full w-full items-center justify-between px-4 md:max-w-7xl md:px-0">
				<img
					src="/images/pete-logo.svg"
					onClick={() => {
						navigate("/")
					}}
					width={30}
				/>
				<div className="flex gap-3">
					{main.navLinks.map((link) => (
						<Button
							variant={"link"}
							className={`p-0 text-white/75 transition-all duration-75 ease-in hover:bg-none hover:text-[#c18dbf] hover:no-underline ${isActive(link[1]) && "text-primary"}`}
							key={link.join("-")}
							onClick={() => {
								navigate(link[1])
							}}>
							{t(link[0])}
						</Button>
					))}
					{/* <Button
						onClick={() => {
							navigate("/pwa")
						}}>
						{t("label.proceedPWA")}
					</Button> */}
				</div>
			</div>
		</header>
	)
}
