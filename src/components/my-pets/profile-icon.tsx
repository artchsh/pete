import React, { useEffect } from "react"
import { Pet_Response } from "@declarations"
import { axiosAuth as axios } from "@/lib/utils"
import { API } from "@config"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
interface PetIcon {
	_id: string
	setUserPets?: React.Dispatch<React.SetStateAction<Pet_Response[]>>
}

export default function MyPetsProfileIcon({ _id }: PetIcon) {
	// Setups
	const navigate = useNavigate()
	const queryClient = useQueryClient()
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
		enabled: !!_id,
	})

	useEffect(() => {
		queryClient.invalidateQueries()
	}, [])

	return (
		pet &&
		!petPending && (
			<>
				<motion.div className="grid grid-cols-1 rounded-lg border bg-card text-card-foreground" onClick={() => navigate(`/pwa/pets/${pet._id}`)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					<img src={pet.imagesPath[0]} className="aspect-square h-full w-full rounded-lg p-2" />
					<p className="h-fit p-2 pt-0 text-center">{pet.name}</p>
				</motion.div>
			</>
		)
	)
}
