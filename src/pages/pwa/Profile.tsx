import React, { useEffect, lazy, Suspense } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import { useGetFavoritePets, useGetUserPets } from "@/lib/hooks"
import { AnimatePresence, motion } from "framer-motion"
import LoadingSpinner from "@/components/loading-spinner"

const LikedPet = lazy(() => import("@/components/cards/liked-pet"))
const MyPetIconProfile = lazy(() => import("@/components/my-pet-icon-profile"))
const MyProfileCard = lazy(() => import("@/components/cards/my-profile"))

export default function Profile() {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { updateNavText } = useNav()

	// Fetch data
	const { data: userPets, error: userPetsError, isPending: userPetsPending } = useGetUserPets()
	const { data: favoritePets, error: favoritePetsError, isPending: favoritePetsPending } = useGetFavoritePets()

	if (userPetsError) {
		console.error(userPetsError)
	}

	if (favoritePetsError) {
		console.error(favoritePetsError)
	}

	useEffect(() => {
		updateNavText(t("header.profile"))
	}, [favoritePets])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<div className="mb-20 block w-full gap-2 p-3">
				<Suspense fallback={<div>Loading...</div>}>
					{isAuthenticated ? (
						<MyProfileCard />
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

				{isAuthenticated && (
					<div className="mt-3 rounded-lg bg-card p-3 shadow-lg">
						<div className="flex justify-between">
							<p className="font-bold">{t("label.myPets")}</p>
							{userPets && userPets.length > 3 && (
								<Button
									variant={"link"}
									className="m-0 h-fit items-center gap-1.5 p-0"
									onClick={() => {
										navigate("/pwa/users/me/pets")
									}}>
									{t("button.seeAll") + ` (${userPets.length})`}
									<ArrowRight />
								</Button>
							)}
						</div>
						<div className="mt-2 grid grid-cols-3 grid-rows-1 gap-2">
							{userPetsPending && <LoadingSpinner />}
							<AnimatePresence>{userPets?.slice(0, 2).map((pet, index) => <MyPetIconProfile key={index} _id={pet._id} />)}</AnimatePresence>
							<motion.div className="flex flex-col items-center justify-center rounded-lg border bg-card text-card-foreground" onClick={() => navigate("/pwa/pets/add")} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
								<Plus />
								<p className="h-fit p-2 pt-0 text-center">{t("pet.add.btn")}</p>
							</motion.div>
						</div>
					</div>
				)}

				{/* <div className="mt-3 rounded-lg bg-card p-3 shadow-lg">
					<p className="font-bold">{t("label.myLikes")}</p>
					<div className="grid grid-cols-1 gap-2">
						{favoritePetsPending && <div>Likes loading...</div>}
						<AnimatePresence>{favoritePets && favoritePets.length > 0 && favoritePets?.map((pet, index) => <LikedPet key={index} pet_id={pet} setUserLiked={() => {}} />)}</AnimatePresence>
					</div>
				</div> */}
			</div>
		</>
	)
}
