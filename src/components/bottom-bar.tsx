import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, Settings, User } from "lucide-react"
import { AnimatePresence } from "framer-motion"

export default function BottomBar() {
	const [active, setActive] = useState<{
		main: boolean
		profile: boolean
		settings: boolean
	}>({
		main: false,
		profile: false,
		settings: false,
	})
	const { t } = useTranslation()
	const location = useLocation()

	function isActive(path: string): boolean {
		let loc = location.pathname
		if (loc.endsWith("/")) {
			loc = loc.slice(0, -1)
		}
		return loc === path
	}

	useEffect(() => {
		setActive({
			main: isActive("/pwa"),
			profile: isActive("/pwa/profile"),
			settings: isActive("/pwa/settings"),
		})
	}, [location])

	return (
		<nav className="fixed bottom-0 z-50 flex h-16 w-full justify-center bg-background/75">
			<div className="flex w-full max-w-xl items-center justify-around">
				<Link className={`text-center ${active.main ? "text-[#C18DBF]" : "text-muted"}`} to={"/pwa/"} key={"main"}>
					<Home className="mx-auto" />
					<p className="text-xs">{t("navigation_main_bar.pages.main")}</p>
				</Link>
				<Link className={`text-center ${active.profile ? "text-[#C18DBF]" : "text-muted"}`} to={"/pwa/profile"} key={"profile"}>
					<User className="mx-auto" />
					<p className="text-xs">{t("navigation_main_bar.pages.profile")}</p>
				</Link>
				<Link className={`text-center ${active.settings ? "text-[#C18DBF]" : "text-muted"}`} to={"/pwa/settings"} key={"settings"}>
					<Settings className="mx-auto" />
					<p className="text-xs">{t("navigation_main_bar.pages.settings")}</p>
				</Link>
			</div>
		</nav>
	)
}
