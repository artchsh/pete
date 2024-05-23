import ChangeCity from "@/components/change-city"
import { HomeIcon, PawIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LOCAL } from "@config"
import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export default function GetStartedPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [userType, setUserType] = React.useState<"private" | "shelter" | undefined>()

	function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		localStorage.setItem(LOCAL.userType, e.currentTarget.name)
		setUserType(e.currentTarget.name as "private" | "shelter")
	}

	function handleSubmit() {
		localStorage.setItem(LOCAL.getStartedCompleted, "true")
		if (userType === "private") navigate("/pwa")
		if (userType === "shelter") navigate("/auth/register")
	}

	return (
		<>
			<div className="h-screen w-full p-4">
				<div className="space-y-3">
					<div className="space-y-3 p-3 text-center">
						<h1 className="text-2xl font-bold">{t("getStarted.title")}</h1>
						<p className="text-center">{t("getStarted.description")}</p>
					</div>
					<div className="grid grid-rows-1 grid-cols-2 w-full max-w-full gap-3">
						<Button onClick={handleClick} className={cn("h-full flex-col gap-2 active:scale-100", userType === "private" ? " border-purple-300" : "")} variant={"outline"} name="private">
							{t("user.type.private")}
							<HomeIcon size={64} color="black" />
							<p className="text-wrap">{t("getStarted.choice.private")}</p>
						</Button>
						<Button onClick={handleClick} className={cn("h-full flex-col gap-2 active:scale-100", userType === "shelter" ? " border-purple-300" : "")} variant={"outline"} name="shelter">
							{t("user.type.shelter")}
							<PawIcon size={64} color="black" />
							<p className="text-wrap">{t("getStarted.choice.shelter")}</p>
						</Button>
					</div>
					<div className="space-y-3 p-3 text-center">
				
						<p className="text-center">{t("warning.city.description")}</p>
					</div>
					<ChangeCity />
					<Button className="w-full" onClick={handleSubmit}>{t("getStarted.submit")}</Button>
				</div>
			</div>
		</>
	)
}
