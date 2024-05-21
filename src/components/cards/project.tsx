import React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/button"
import { Github, Instagram } from "lucide-react"

export default function ProjectCard({ description = false, social = false }: { description?: boolean; social?: boolean }) {
	const { t } = useTranslation()

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<img loading="lazy" src="/images/pete-logo.svg" width={30} />
			<p className="text-2xl font-semibold">Pete</p>
			{social && (
				<div className="flex gap-2">
					<Button variant={"link"} className="gap-2 p-0 text-white/75 transition-all duration-75 ease-in hover:bg-none hover:text-[#c18dbf] hover:no-underline" onClick={() => window.open("https://github.com/pete-kz", "_blank")}>
						Github <Github />
					</Button>
					<Button variant={"link"} className="gap-2 p-0 text-white/75 transition-all duration-75 ease-in hover:bg-none hover:text-[#c18dbf] hover:no-underline" onClick={() => window.open("https://instagram.com/pete.kazakhstan", "_blank")}>
						Instagram <Instagram />
					</Button>
				</div>
			)}
			{description && <p className="text-muted-foreground">{t("label.slogan")}</p>}
		</div>
	)
}
