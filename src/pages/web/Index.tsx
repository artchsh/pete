import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import ChangeLanguage from "@/components/change-language"
import { Card } from "@/components/ui/card"
import { useQuery } from "@/lib/utils"
import PWAInstallComponent from "@/components/pwa-install"
import i18n from "@/i18"

export default function IndexPage() {
	// Setups
	const navigate = useNavigate()
	const { t } = useTranslation()
	const query = useQuery()

	// States
	const [showHowToInstall, setShowHowToInstall] = React.useState(false)

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
				<h1 className="cursor-default select-none text-9xl font-bold text-[#c18dbf] transition-all duration-150 ease-in-out hover:scale-110">PETE</h1>
				<p className="text-center text-2xl">{i18n.t("label.slogan")}</p>
				<Card className="w-full p-3">
					<div className="mx-auto grid items-center gap-1.5">
						<ChangeLanguage label={false} />
						<div className="flex gap-1.5">
							<Button className="w-full" onClick={go}>
								{t("label.goTo")}
							</Button>
							{/* <Button
								className="w-full"
								onClick={() => {
									setShowHowToInstall(() => true)
								}}>
								{t("label.install")}
							</Button> */}
						</div>
					</div>
				</Card>
			</div>

			<PWAInstallComponent manualApple icon="images/pete-logo.svg" name="Pete" manifestUrl="/manifest.webmanifest" open={showHowToInstall} />
		</div>
	)
}
