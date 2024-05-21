import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import { useQuery } from "@/lib/utils"
import i18n from "@/i18"

export default function IndexPage() {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()
	const query = useQuery()

	// Functions
	function go() {
		navigate("/pwa")
	}

	useEffect(() => {
		if (query.get("pwa") === "true") {
			navigate("/pwa")
		}
	}, [])

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<div className="flex flex-col gap-3">
				<h1 className="cursor-default select-none text-9xl font-bold text-primary transition-all duration-150 ease-in-out hover:scale-110">PETE</h1>
				<p className="text-center text-[1.3rem]">{i18n.t("label.slogan")}</p>
				<div className="w-full p-3 pt-0">
					<div className="mx-auto grid items-center gap-1.5">
						<ChangeLanguage label={false} />
						
							<Button className="w-full" onClick={go}>
								{t("label.goTo")}
							</Button>
						
					</div>
				</div>
			</div>
		</div>
	)
}
