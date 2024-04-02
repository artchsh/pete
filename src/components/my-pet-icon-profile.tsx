import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AuthState, Pet_Response } from "@declarations"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import PetOverlay from "./pet-overlay"
import { axiosAuth as axios } from "@/lib/utils"
import { API } from "@config"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { AxiosError } from "axios"
import { motion } from "framer-motion"
interface PetIcon {
	_id: string
	setUserPets?: React.Dispatch<React.SetStateAction<Pet_Response[]>>
}

export default function MyPetIconProfile({ _id }: PetIcon) {
	// Setups
	const { t } = useTranslation()
	const authState = useAuthUser<AuthState>()
	const queryClient = useQueryClient()
	const {
		data: pet,
		error: petError,
		isPending: petPending,
	}: {
		data: Pet_Response | undefined
		error: AxiosError | null
		isPending: boolean
	} = useQuery({
		queryKey: ["pet", _id],
		queryFn: () => axios.get(`${API.baseURL}/pets/find/${_id}`).then((res) => res.data),
	})

	// States
	const [openPet, setOpenPet] = useState<boolean>(false)

	if (petError) {
		<Card className="flex flex-col items-center gap-2 p-3">
			<Avatar>
				<AvatarFallback>{t("error")}</AvatarFallback>
			</Avatar>
			<p className="text-center">{t("error")}</p>
		</Card>
	}

	useEffect(() => {
		queryClient.fetchQuery({ queryKey: ["pet", _id] })
	}, [])

	return (
		pet &&
		!petPending && (
			<>
				{authState && authState._id === pet.ownerID ? <PetOverlay pet={pet} edit open={openPet} setOpen={setOpenPet} /> : <PetOverlay pet={pet} info contacts like open={openPet} setOpen={setOpenPet} />}
				<motion.div
					className="grid grid-cols-1 border rounded-lg bg-card text-card-foreground"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<img src={pet.imagesPath[0]} className="aspect-square h-full w-full rounded-lg p-2" />
					<p className="h-fit text-center p-2 pt-0">{pet.name}</p>
				</motion.div>
			</>
		)
	)
}
