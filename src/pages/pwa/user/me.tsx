import React, { useEffect, lazy, Suspense } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import MyPetsSection from "@/components/my-pets/section"
import FavoritesSection from "@/components/favorites/section"

const MyProfileSection = lazy(() => import("@/components/cards/user-profile"))

export default function Profile() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(t("header.profile"))
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<div className="block w-full space-y-2 p-3">
				<Suspense fallback={<div>Loading...</div>}>
					{isAuthenticated ? (
						<MyProfileSection _id="me" />
					) : (
						<Button
							variant={"secondary"}
							className="w-full gap-2 font-bold"
							onClick={() => {
								navigate("/auth/login")
							}}>
							{t("button.authorization")}
						</Button>
					)}
				</Suspense>
				<MyPetsSection />
				<FavoritesSection />
			</div>
		</>
	)
}
