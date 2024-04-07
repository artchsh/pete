import React, { lazy } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetUserPets } from "@/lib/hooks"
import { AnimatePresence, motion } from "framer-motion"
import LoadingSpinner from "@/components/loading-spinner"

const MyPetIconProfile = lazy(() => import("@/components/my-pets/profile-icon"))

export default function MyPetsSection({ user_id = "me" }: { user_id?: string }) {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()

	// Fetch data
	const { data: userPets, isPending: userPetsPending } = useGetUserPets(user_id)

	return (
		isAuthenticated && (
			<div className="mt-3 rounded-lg bg-card p-3 shadow-lg">
				<div className="flex justify-between">
					<p className="font-bold">{user_id === "me" ? t("label.myPets") : t("label.pets")}</p>
					{userPets && userPets.length > 3 && (
						<Button
							variant={"link"}
							className="m-0 h-fit items-center gap-1.5 p-0"
							onClick={() => {
								navigate(`/pwa/users/${user_id}/pets`)
							}}>
							{t("button.seeAll") + ` (${userPets.length})`}
							<ArrowRight />
						</Button>
					)}
				</div>
				<motion.div layout className="mt-2 grid grid-cols-3 grid-rows-1 gap-2">
					{userPetsPending && <LoadingSpinner />}
					<AnimatePresence>{userPets?.slice(0, user_id === "me" ? 2 : 3).map((pet, index) => <MyPetIconProfile key={index} _id={pet._id} />)}</AnimatePresence>
					{user_id === "me" && (
						<motion.div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground" onClick={() => navigate("/pwa/pets/add")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
							<Plus />
							<p className="h-fit p-2 pt-0 text-center">{t("pet.add.btn")}</p>
						</motion.div>
					)}
				</motion.div>
			</div>
		)
	)
}
