import React from "react"
import { useTranslation } from "react-i18next"
import { AuthState, Pet_Response } from "@declarations"
import { Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { axiosAuth as axios, axiosErrorHandler } from "@/lib/utils"
import { API } from "@config"
import { useToast } from "../ui/use-toast"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { AxiosError } from "axios"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function MyPetsLine({ _id }: { _id: string }) {
	// Setups
	const { t } = useTranslation()
	const authHeader = useAuthHeader()
	const isAuthenticated = useIsAuthenticated()
	const authState = useAuthUser<AuthState>()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { toast } = useToast()
	const {
		data: pet,
		isPending: petPending,
	}: {
		data: Pet_Response | undefined
		error: AxiosError | null
		isPending: boolean
	} = useQuery({
		queryKey: ["pet", _id],
		queryFn: () => axios.get(`${API.baseURL}/pets/${_id}`).then((res) => res.data),
	})

	// Functions
	function removePet(pet: Pet_Response) {
		// If user is not authenticated, do not do anything
		if (!isAuthenticated) return

		// Send request to remove pet from user data
		axios
			.delete(`${API.baseURL}/pets/${pet._id}`, {
				headers: { Authorization: authHeader },
			})
			.then(() => {
				toast({ description: `${t("pet.goodbye")}, ${pet.name}!` })
				if (authState) {
					queryClient.invalidateQueries({
						queryKey: ["user", authState._id, "pets"],
					})
				}
			})
			.catch(axiosErrorHandler)
	}

	return (
		pet &&
		!petPending && (
			<>
				<motion.div className="flex w-full items-center justify-between gap-2 rounded-lg border bg-card p-3 text-card-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
							<AvatarFallback>{pet.name[0]}</AvatarFallback>
						</Avatar>
						<p className="text-center">{pet.name}</p>
					</div>
					{authState && authState._id === pet.ownerID && (
						<div className="grid grid-cols-2 grid-rows-1 gap-2">
							<Button
								className="h-10 w-10 p-2"
								variant={"outline"}
								onClick={() => {
									navigate(`/pwa/pets/${pet._id}/change`)
								}}>
								<Pencil size={14} />
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button className="h-10 w-10 p-2" variant={"outline"}>
										<Trash size={14} style={{ color: "#FF0000" }} />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>{t("alert.you_sure")}</AlertDialogTitle>
										<AlertDialogDescription>{t("alert.delete_pet_profile")}</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>{t("alert.back")}</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												removePet(pet)
											}}>
											{t("alert.sure")}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					)}
				</motion.div>
			</>
		)
	)
}
