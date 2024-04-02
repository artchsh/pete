import React, { lazy } from "react"
import { ChevronLeft, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useNav } from "@/lib/contexts"

const ChangeProfileForm = lazy(() => import("@/components/forms/change-profile"))

export default function MobilePageHeader({ href }: { href: string }) {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { navText } = useNav()

	return (
		<div className="grid h-16 w-full grid-cols-3 grid-rows-1">
			<div className="flex items-center justify-start pl-3">
				<Button
					variant={"link"}
					onClick={() => {
						navigate(href)
					}}
					className="flex h-fit justify-start gap-1 p-4 pl-0 text-muted-foreground">
					<div className="flex items-center">
						<ChevronLeft />
						{t("label.back")}
					</div>
				</Button>
			</div>
			<div className="flex items-center justify-center overflow-visible text-ellipsis text-2xl font-bold">{navText}</div>
			<div className="flex w-full items-center justify-end pr-3">
				{href === "/pwa" && (
					<ChangeProfileForm>
						<Button className="" type="submit" variant={"link"}>
							<Pencil />
						</Button>
					</ChangeProfileForm>
				)}
			</div>
		</div>
	)
}
