import React, { lazy, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { User_Response } from "@declarations"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Helmet } from "react-helmet"
import { useNav } from "@/lib/contexts"
import { axiosErrorHandler } from "@/lib/utils"
import MyPetsSection from "@/components/my-pets/section"
const UserProfileCard = lazy(() => import("@/components/cards/user-profile"))

export default function User() {
	// Setups
	const { userId } = useParams()
	const { data: user, isPending } = useQuery<User_Response, AxiosError>({
		queryKey: ["user", userId],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/users/${userId}`)
				.then((res) => res.data)
				.catch(axiosErrorHandler),
		enabled: !!userId,
	})
	const { updateNavText } = useNav()

	useEffect(() => {
		updateNavText(user?.login ? user?.login : user?.firstName || "404")
	}, [user])

	return (
		<>
			<Helmet>
				<title>{"Pete - " + (user?.login ? user?.login : user?.firstName) || "404"}</title>
			</Helmet>
			<div className="mb-20 block w-full gap-2 p-3">
				<div className="space-y-2">
					{isPending ? (
						<div>Loading...</div>
					) : (
						<div className="space-y-2">
							<UserProfileCard _id={userId} />
							<MyPetsSection user_id={userId} />
						</div>
					)}
				</div>
			</div>
		</>
	)
}
