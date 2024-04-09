import React from "react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

export default function SupportCard() {
	// Setups
	const { t } = useTranslation()

	return (
		<Card className="p-4">
			<CardTitle>{t("label.support.default")}</CardTitle>
			<CardContent className="mt-2 p-0">
				<p className="italic">{`(${t("label.support.ten")})`}</p>
				<p>{t("label.support.usVia")} <Button
							className="p-0"
							variant={"link"}
							onClick={() => {
								window.open("https://pay.kaspi.kz/pay/s0at4ddu", "_blank")
							}}>
							Kaspi
						</Button></p>
				<p className="italic">{`${t("label.support.note")}`}</p>
			</CardContent>
		</Card>
	)
}
