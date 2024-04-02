import React, { lazy, useEffect } from "react"
import { useTranslation } from "react-i18next"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { Pet_Response, User_Response } from "@declarations"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import { AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const MyPetIcon = lazy(() => import("@/components/my-pet-icon"))

export default function Pets() {
	// Setups
	const { userId } = useParams()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { data: user, isPending: userPending } = useQuery<User_Response, AxiosError>({
		queryKey: ["user", userId],
		queryFn: () => axios.get(`${API.baseURL}/${userId}`).then((res) => res.data),
	})
	const { data: userPets, isPending: userPetsPending } = useQuery<Pet_Response[], AxiosError>({
		queryKey: ["user", userId, "pets"],
		queryFn: () => axios.get(`${API.baseURL}/${userId}/pets`).then((res) => res.data),
	})
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(user?.companyName ? user?.companyName : user?.firstName || "404")
	}, [user])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + t("header.profile")}</title>
			</Helmet>
			<div className="mt-3 grid gap-3 px-3">
				{(userPetsPending || userPending) && <div>Loading...</div>}
				<AnimatePresence>{userPets?.map((pet, index) => <MyPetIcon orientation="horizontal" key={index} _id={pet._id} />)}</AnimatePresence>
			</div>
			<div className="fixed bottom-6 right-6">
				<Button variant={"secondary"} size={"icon"} onClick={() => navigate("/pwa/pets/add")}>
					<Plus />
				</Button>
			</div>
		</>
	)
}
