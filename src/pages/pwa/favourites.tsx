import React from "react"
import { useTranslation } from "react-i18next"
import { useGetFavoritePets } from "@/lib/hooks"
import { AnimatePresence } from "framer-motion"
import LoadingSpinner from "@/components/loading-spinner"
import LikedPet from "@/components/favorites/pet"

export default function FavouritesPage() {
	// Setups
	const { t } = useTranslation()

	// Fetch data
	const { data: favoritePets } = useGetFavoritePets()

	return (
		<div className="h-screen w-full p-4">
			<div className="mb-2">
				<h3 className="flex gap-2 text-xl font-bold">
					{t("label.myLikes")}
					{typeof favoritePets !== typeof [] || ((favoritePets.length == 0) && <LoadingSpinner />)}
				</h3>
				<p className="text-muted">{t("label.seeFavourites")}</p>
			</div>
			<div className="grid grid-cols-3 gap-2">
				<AnimatePresence>{favoritePets && favoritePets.length > 0 && favoritePets?.map((pet, index) => <LikedPet key={index} pet_id={pet} />)}</AnimatePresence>
			</div>
		</div>
	)
}
