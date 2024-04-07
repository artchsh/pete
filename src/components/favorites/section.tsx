import React from "react"
import { useTranslation } from "react-i18next"
import { useGetFavoritePets } from "@/lib/hooks"
import { AnimatePresence } from "framer-motion"
import LoadingSpinner from "@/components/loading-spinner"
import LikedPet from "@/components/favorites/pet"

export default function FavoritesSection() {
	// Setups
	const { t } = useTranslation()

	// Fetch data
	const { data: favoritePets, isPending: favoritePetsPending } = useGetFavoritePets()

	return (
		<div className="mt-3 rounded-lg bg-card p-3 shadow-lg">
			<p className="mb-2 flex gap-2 font-bold">
				{t("label.myLikes")}
				{favoritePetsPending && <LoadingSpinner />}
			</p>
			<div className="grid grid-cols-3 gap-2">
				<AnimatePresence>{favoritePets && favoritePets.length > 0 && favoritePets?.map((pet, index) => <LikedPet key={index} pet_id={pet} />)}</AnimatePresence>
			</div>
		</div>
	)
}
