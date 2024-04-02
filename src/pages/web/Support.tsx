import React from "react"
import SupportCard from "@/components/cards/support"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"

export default function SupportPage() {
	// Setups
	const { t } = useTranslation()

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center">
			<Helmet>
				<title>{"Pete - " + t("label.support.default")}</title>
			</Helmet>
			<SupportCard />
		</div>
	)
}
