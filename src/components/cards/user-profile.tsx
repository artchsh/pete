import React from "react"
import { User_Response } from "@declarations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosErrorHandler } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API } from "@config"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"
import ChangeProfileForm from "../forms/change-profile"
import { Pencil } from "lucide-react"
import InstagramSection from "../instagram-section"
import { useNavigate } from "react-router-dom"

export default function UserProfileCard({ _id }: { _id?: string }) {
	// Setups
	const authHeader = useAuthHeader()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const signOut = useSignOut()
	const { data: user, isPending: userPending } = useQuery<User_Response>({
		queryKey: ["user", _id ? _id : "me"],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/${_id ? "users/" + _id : "users/me"}`, { headers: { Authorization: _id ? undefined : authHeader } })
				.then((res) => res.data)
				.catch(axiosErrorHandler),
	})

	return (
		<>
			{userPending && <div>Loading...</div>}
			{user && (
				<>
					<div className="flex gap-2 rounded-lg p-3 text-card-foreground shadow-sm">
						<div>
							<Avatar className="h-[140px] w-[140px] shadow-vertical-secondary">
								<AvatarImage src={"/images/pete-logo.svg"} alt={"PETE"} />
								<AvatarFallback>P</AvatarFallback>
							</Avatar>
							<p className="mt-2 w-[140px] font-semibold">{user.login ? user.login : `${user.firstName} ${user.lastName}`}</p>
						</div>
						<div className="flex max-h-full w-full flex-col justify-between">
							<Button className="w-full" onClick={() => window.open("https://wa.me/" + user.phone.replace("+", ""), "_blank")}>
								{t("label.whatsapp")}
							</Button>

							{!_id ||
								(_id === "me" && (
									<div className="flex space-x-2">
										<Button
											onClick={() => {
												signOut()
												navigate("/pwa")
											}}
											variant={"destructive"}>
											{t("label.signOut")}
										</Button>
										<ChangeProfileForm>
											<Button className="text-wrap">
												<Pencil />
											</Button>
										</ChangeProfileForm>
									</div>
								))}
						</div>
					</div>
					<InstagramSection login={user?.instagram} />
				</>
			)}
		</>
	)
}
