import React from "react"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useTranslation } from "react-i18next"

export default function SignOutButton() {
	const signOut = useSignOut()
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<Button
			onClick={() => {
                navigate("/auth/login")
				signOut()
				
			}}
			variant={"destructive"}>
			{t("label.signOut")}
		</Button>
	)
}
