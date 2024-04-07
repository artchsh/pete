import React, { lazy, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response } from "@declarations"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import { AnimatePresence } from "framer-motion"
import MobilePageHeader from "@/components/mobile-page-header"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"

const MyPetsLine = lazy(() => import("@/components/my-pets/line"))

export default function Pets() {
	// Setups
	const { userId } = useParams()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const { data: userPets, isPending: userPetsPending } = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["user", userId, "pets"],
		queryFn: () => axios.get(`${API.baseURL}/users/${userId}/pets`, { headers: { Authorization: authHeader } }).then((res) => res.data),
		enabled: !!userId,
	})
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(t("label.pets"))
	}, [])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<MobilePageHeader href={userId !== "me" ? "/pwa/users/" + userId : "/pwa/profile"} />
			<div className="mt-3 grid gap-3 px-3">
				{userPetsPending && <div>Loading...</div>}
				<AnimatePresence>{userPets?.map((pet, index) => <MyPetsLine key={index} _id={pet._id} />)}</AnimatePresence>
			</div>
		</>
	)
}
