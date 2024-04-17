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
	const [userType, setUserType] = React.useState<"private" | "shelter">("private")

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
					<div className="space-y-3 rounded-lg bg-card p-3">
						<h1 className="text-2xl font-bold">{t("getStarted.title")}</h1>
						<p className="text-center">{t("getStarted.description")}</p>
					</div>
					<div className="flex w-full max-w-full justify-center gap-3">
						<Button onClick={handleClick} className={cn("h-fit flex-col gap-2 active:scale-100", userType === "private" ? " border-purple-300" : "")} variant={"outline"} name="private">
							{t("user.type.private")}
							<HomeIcon size={64} color="white" />
							<p className="text-wrap text-muted">{t("getStarted.choice.private")}</p>
						</Button>
						{/* <Button onClick={handleClick} variant={"outline"} name="private">Nursery</Button> */}
						<Button onClick={handleClick} className={cn("h-fit flex-col gap-2 active:scale-100", userType === "shelter" ? " border-purple-300" : "")} variant={"outline"} name="shelter">
							{t("user.type.shelter")}
							<PawIcon size={64} color="white" />
							<p className="text-wrap text-muted">{t("getStarted.choice.shelter")}</p>
						</Button>
					</div>
					<Button className="w-full" onClick={handleSubmit}>{t("getStarted.submit")}</Button>
				</div>
			</div>
		</>
	)
}
