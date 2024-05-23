import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, Settings, User } from "lucide-react"

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
		<nav className="absolute bottom-0 flex h-20 pt-2 w-full justify-center bg-background">
			<div className="w-full max-w-xl grid grid-cols-3 mx-4">
				<Link className="text-center text-primary" to={"/pwa/"} key={"main"}>
					<div className={`${active.main ? "rounded-md bg-secondary" : ""} py-1 transition-all ease-in-out duration-150`}>
						<Home className={"mx-auto"} />
					</div>
					<p className="text-xs">{t("navigation_main_bar.pages.main")}</p>
				</Link>
				<Link className="text-center text-primary" to={"/pwa/profile"} key={"profile"}>
					<div className={`${active.profile ? "rounded-md bg-secondary" : ""} py-1 transition-all ease-in-out duration-150`}>
						<User className={"mx-auto"} />
					</div>
					<p className="text-xs">{t("navigation_main_bar.pages.profile")}</p>
				</Link>
				<Link className="text-center text-primary" to={"/pwa/settings"} key={"settings"}>
					<div className={`${active.settings ? "rounded-md bg-secondary" : ""} py-1 transition-all ease-in-out duration-150`}>
						<Settings className={"mx-auto"} />
					</div>
					<p className="text-xs">{t("navigation_main_bar.pages.settings")}</p>
				</Link>
			</div>
		</nav>
	)
}
