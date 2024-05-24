import React, { useEffect, lazy, Suspense } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import MyPetsSection from "@/components/my-pets/section"
import { ShieldQuestionIcon } from "lucide-react"
import useSignOut from "react-auth-kit/hooks/useSignOut"

const MyProfileSection = lazy(() => import("@/components/cards/user-profile"))

export default function Profile() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { updateNavText } = useNav()
	const signOut = useSignOut()

	useEffect(() => {
		updateNavText(t("header.profile"))

		if (!isAuthenticated) {
			signOut()
		}
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<div className="block h-screen w-full space-y-2 p-3">
				<Suspense fallback={<div>Loading...</div>}>
					{isAuthenticated ? (
						<>
							<MyProfileSection _id="me" />
							<MyPetsSection />
						</>
					) : (
						<div className="flex h-full flex-col items-center justify-center">
							<div className="rounded-xl bg-card p-3">
								<div className="mb-3 flex max-w-[300px] items-center gap-1.5">
									<ShieldQuestionIcon className="h-14 w-20" />
									<h1 className="h-fit text-wrap">{t("label.authorizeToProfile")}</h1>
								</div>
								<Button
									variant={"secondary"}
									className="w-full font-bold"
									onClick={() => {
										navigate("/auth/login")
									}}>
									{t("button.authorization")}
								</Button>
							</div>
						</div>
					)}
				</Suspense>
				<div className="h-20"></div>
			</div>
		</>
	)
}
