import React, { lazy } from "react"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response } from "@declarations"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { axiosErrorHandler } from "@/lib/utils"
const MyPetLine = lazy(() => import("@/components/my-pets/line"))

export default function UserPets() {
	// Setups
	const { userId } = useParams()
	const { t } = useTranslation()
	const { data: pets } = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["user", userId, "pets"],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/users/${userId}/pets`)
				.then((res) => res.data)
				.catch(axiosErrorHandler),
		enabled: !!userId,
	})

	return (
		<>
			<h1 className="text-2xl font-bold">{t("label.userPets")}</h1>
			<div className="mt-3 grid grid-cols-1 gap-2">
				{pets?.map((pet) => <MyPetLine key={pet._id} {...pet} />)}
				{pets?.length === 0 && t("label.noPets")}
			</div>
		</>
	)
}
