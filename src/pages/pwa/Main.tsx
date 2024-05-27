/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTranslation } from "react-i18next"
import { API, LOCAL } from "@config"
import { AuthState, Pet_Response } from "@declarations"
import { axiosAuth as axios } from "@utils"
import { HeartHandshakeIcon } from "lucide-react"
// import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { Filter } from "lucide-react"
import React, { useState, useEffect } from "react"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { AxiosResponse } from "axios"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { useGetFavoritePets } from "@/lib/hooks"
import SimplePetCard from "@/components/cards/pet-simple"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"

// const PetFilter = lazy(() => import("@/components/pet-filter"))

export default function Main() {
	// Setups
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const authState = useAuthUser<AuthState>()
	const { data: allPets } = useQuery<Pet_Response[]>({
		queryKey: ["pets"],
		queryFn: () => axios.get(`${API.baseURL}/pets`).then((res: AxiosResponse<Pet_Response[]>) => res.data),
	})
	const { data: likedPets } = useGetFavoritePets()
	const navigate = useNavigate()

	// States
	const [search, setSearch] = useState<string>("")

	useEffect(() => {
		if ((!localStorage.getItem(LOCAL.getStartedCompleted) || localStorage.getItem(LOCAL.getStartedCompleted) === "false" || !localStorage.getItem(LOCAL.userType)) && !isAuthenticated) {
			navigate("/pwa/get-started")
		}
	}, [])

	return (
		<>
			{isAuthenticated && (
				<div className="px-4 py-2 flex justify-between">
					<div>
					<span>{`👋 ${t("alert.welcomeBack")}, `}</span><span className="font-semibold">{authState?.firstName + " " + authState?.lastName}!</span>
					</div>
				</div>
			)}
			<div className="sticky top-0 flex items-center gap-1.5 bg-white px-4 py-2">
				<Input
					onChange={(e) => {
						setSearch(e.target.value)
					}}
					placeholder={t("label.searchPets")}
				/>
			</div>
			{likedPets && likedPets.length > 0 && (
				<div className="mb-2 px-4">
					<div className="space-y-2 rounded-md border border-purple-500 shadow bg-purple-50 shadow-purple-500 p-2">
						<div className="flex items-center gap-2">
							<HeartHandshakeIcon className="h-10 w-10 text-purple-500" />
							<h3 className="font-semibold">{t("alert.before_you_look")}</h3>
						</div>
						<div className="grid grid-cols-3 gap-1.5">
							{likedPets.map((petId, index) => (
								<SimplePetCard key={index} fetchById petId={petId} />
							))}
						</div>
						{likedPets.length > 3 && (
							<div>
								<Button onClick={() => navigate("/pwa/favourites")}>{`${t("alert.before_you_look_button")} ${likedPets.length > 3 ? `(${likedPets.length - 3})` : ""}`}</Button>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="px-4">
				{allPets && allPets.length > 0 ? (
					<div className="grid grid-cols-3 gap-1.5">
						{allPets
							.filter((pet) => pet.name.includes(search))
							.map((pet) => (
								<SimplePetCard pet={pet} key={pet._id} />
							))}
					</div>
				) : (
					<>

					</>
				)}
			</div>
			<div className="h-20"></div>
		</>
	)
}