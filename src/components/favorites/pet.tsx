import React, { lazy } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AuthState, Pet_Response } from "@/lib/declarations"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { axiosAuth as axios, axiosErrorHandler } from "@utils"
import { API, LOCAL } from "@config"
import { AxiosError } from "axios"
import { useTranslation } from "react-i18next"
import { useToast } from "../ui/use-toast"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { useQuery } from "@tanstack/react-query"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useNavigate } from "react-router-dom"
const RemoveLikeAlert = lazy(() => import("@/components/alerts/remove-like"))

export default function FavoritePet({ pet_id }: { pet_id: Pet_Response["_id"] }) {
	// Setups
	const isAuthenticated = useIsAuthenticated()
	const authState = useAuthUser<AuthState>()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const { toast } = useToast()
	const authHeader = useAuthHeader()
	const {
		data: pet,
	}: {
		data: Pet_Response | undefined
		error: AxiosError | null
		isPending: boolean
	} = useQuery({
		queryKey: ["pet", pet_id],
		queryFn: () => axios.get(`${API.baseURL}/pets/${pet_id}`).then((res) => res.data),
		enabled: !!pet_id,
	})

	// Functions
	function removePetFromLiked(pet_id: string) {
		// If user is not authenticated, remove pet from local storage
		if (!isAuthenticated || !authState) {
			// Parse liked pets from local storage
			let browserLiked = JSON.parse(localStorage.getItem(LOCAL.liked) || "[]") as string[]
			// Filter liked pets from unliked pet
			browserLiked = browserLiked.filter((likedPet) => likedPet != pet_id)

			// Fetch all pets
			axios
				.get(`${API.baseURL}/pets`)
				.then(() => {
					// Save liked pets to local storage
					localStorage.setItem(LOCAL.liked, JSON.stringify(browserLiked))
					toast({ description: t("notifications.liked_remove") })
				})
				.catch(axiosErrorHandler)

			return
		}

		// Send request to remove liked pet from user data
		axios
			.delete(`${API.baseURL}/users/me/liked/${pet_id}/remove`, {
				headers: { Authorization: authHeader! },
			})
			.then(() => {
				toast({ description: t("notifications.liked_remove") })
			})
			.catch(axiosErrorHandler)
	}

	return (
		<>
			{pet && (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex cursor-pointer flex-col rounded-lg border bg-card p-3 text-card-foreground">
					<div
						className="w-full text-center"
						onClick={() => {
							navigate("/pwa/pets/" + pet_id)
						}}>
						<Avatar className="mx-auto">
							<AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
							<AvatarFallback>{pet.name[0]}</AvatarFallback>
						</Avatar>
						<p>{pet.name}</p>
					</div>
					<RemoveLikeAlert
						onClick={() => {
							removePetFromLiked(pet_id)
						}}
					/>
				</motion.div>
			)}
		</>
	)
}
