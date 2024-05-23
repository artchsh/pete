/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LOCAL } from "@config"
import { type Pet_Response } from "@declarations"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

import { useToast } from "../ui/use-toast"

export default function FavoriteButton(props: { pet: Pet_Response }) {
	// Setups
	const { t } = useTranslation()
	const { toast } = useToast()

	// States
	const [liked, setLiked] = useState<boolean>(false)

	// Functions
	function likePet() {
		if (!liked) {
			const browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
			browserLiked.push(props.pet._id)
			localStorage.setItem("_data_offline_liked", JSON.stringify(browserLiked))
			toast({
				description: t("pet.liked") + " " + props.pet.name + "!",
			})
			setLiked(true)
		} else {
			removePetFromLiked(props.pet._id)
			setLiked(false)
		}
	}

	function removePetFromLiked(pet_id: string) {
		// Parse liked pets from local storage
		let browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
		// Filter liked pets from unliked pet
		browserLiked = browserLiked.filter((likedPet) => likedPet != pet_id)
		localStorage.setItem("_data_offline_liked", JSON.stringify(browserLiked))
		toast({ description: t("notifications.liked_remove") })
	}

	function getUser() {
		const likedPets = JSON.parse(localStorage.getItem(LOCAL.liked) || "[]") as string[]
		if (likedPets.includes(props.pet._id)) {
			setLiked(true)
		}
	}

	useEffect(() => {
		getUser()
	}, [])

	return (
		<Button size={"icon"} className="absolute right-6 top-6 z-[1] w-fit rounded-sm bg-white" style={{ color: "#FF0000" }} onClick={likePet}>
			<Heart fill={liked ? "#FF0000" : "transparent"} />
		</Button>
	)
}
