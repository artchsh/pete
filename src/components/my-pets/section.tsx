import React from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetUserPets } from "@/lib/hooks"
import { AnimatePresence } from "framer-motion"
import LoadingSpinner from "@/components/loading-spinner"
import SimplePetCard from "../cards/pet-simple"

export default function MyPetsSection({ user_id = "me" }: { user_id?: string }) {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()

	// Fetch data
	const { data: userPets, isPending: userPetsPending } = useGetUserPets(user_id)

	return (

			<div className="mt-3 rounded-lg bg-card p-3 border">
				<div className="flex justify-between">
					<p className="font-bold">{user_id === "me" ? t("label.myPets") : t("label.pets")}</p>
					{userPets && (
						<Button
							variant={"link"}
							className="m-0 h-fit items-center gap-1.5 p-0 cursor-pointer"
							onMouseDown={() => {
								navigate(`/pwa/users/${user_id}/pets`)
							}}>
							{t("button.seeAll") + ` (${userPets.length})`}
							<ArrowRight />
						</Button>
					)}
				</div>
				<div className="mt-2 grid grid-cols-3 grid-rows-1 gap-2">
					{userPetsPending && <LoadingSpinner />}
					<AnimatePresence>{userPets?.slice(0, user_id === "me" ? 2 : 3).map((pet) => <SimplePetCard pet={pet} key={pet._id} />)}</AnimatePresence>
					{isAuthenticated && user_id === "me" && (
						<div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground cursor-pointer" onMouseDown={() => navigate("/pwa/pets/add")}>
							<Plus />
							<p className="h-fit p-2 pt-0 text-center">{t("pet.add.btn")}</p>
						</div>
					)}
				</div>
			</div>
		
	)
}
