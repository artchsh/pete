/* eslint-disable linebreak-style */
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { LOCAL, main } from "@config"
import { Label } from "./ui/label"

const languages = main.languages

export default function ChangeLanguage({ label = true }: { label?: boolean }) {
	// Setups
	const { t, i18n } = useTranslation()

	// States
	const [currentLanguage, setLanguage] = useState<string>("ru")

	// Functions
	function isLangaugeActiveToStyle(langCode: string) {
		return (i18n.language === langCode || currentLanguage === langCode) ? "bg-background border-2 border-primary" : "bg-background"
	}

	function setI18NLanguage(langCode: string) {
		// Change language in i18n context
		i18n.changeLanguage(langCode)
		// Save langauge choice in local storage
		localStorage.setItem(LOCAL.currentLanguage, langCode)
		// Set language in state for rendering
		setLanguage(langCode)
	}

	useEffect(() => {
		// If person has not selected language before or it is other than "ru" or "kz", then set it to default "ru" as in Russian
		if (!languages.map((lang) => lang[0]).includes(localStorage.getItem(LOCAL.i18nLanguage) as "ru" | "kz")) {
			// currentLanguage by default is "ru"
			setI18NLanguage(currentLanguage)
		}
	}, [])

	return (
		<div className="grid w-full items-center gap-1.5 z-[999]">
			{label && <Label>{t("label.language")}</Label>}
			<div className="flex gap-1.5 w-full *:w-full *:px-3 *:py-2 *:first:rounded-l-xl *:last:rounded-r-xl">
				{languages.map((languageSet) => (
					<button key={languageSet[0]} onClick={() => { setI18NLanguage(languageSet[0]) }} className={isLangaugeActiveToStyle(languageSet[0])}>{languageSet[1]}</button>
				))}
			</div>
		</div>
	)
}
