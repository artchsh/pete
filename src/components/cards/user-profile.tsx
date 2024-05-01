import React, { useState, useEffect } from "react"
import { User_Response } from "@declarations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosErrorHandler } from "@/lib/utils"
import axios from "axios"
import { API } from "@config"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { Button } from "../ui/button"
import { useTranslation } from "react-i18next"
import ChangeProfileForm from "../forms/change-profile"
import { Pencil } from "lucide-react"
import InstagramSection from "../instagram-section"
import SignOutButton from "../sign-out-button"

export default function UserProfileCard({ _id = "me" }: { _id?: string }) {
	// Setups
	const authHeader = useAuthHeader()
	const { t } = useTranslation()

	// States
	const [user, setUser] = useState<User_Response | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)

	// Functions
	function fetchUser() {
		axios
			.get(`${API.baseURL}/users/${_id}`, { headers: { Authorization: _id == "me" ? authHeader  : undefined } })
			.then((res) => {
				setUser(res.data)
				
			})
			.catch(axiosErrorHandler)
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		fetchUser()
	}, [])

	return (
		<>
			{loading && <div>Loading...</div>}
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
										<SignOutButton />
										<ChangeProfileForm>
											<Button className="text-wrap">
												<Pencil />
											</Button>
										</ChangeProfileForm>
									</div>
								))}
						</div>
					</div>
					{user?.instagram && <InstagramSection login={user?.instagram} />}
				</>
			)}
		</>
	)
}
