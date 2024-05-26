import React, { useState, useEffect } from "react"
import { User_Response } from "@declarations"
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
import { WhatsAppIcon } from "../icons"
import useSignOut from "react-auth-kit/hooks/useSignOut"

export default function UserProfileCard({ _id = "me" }: { _id?: string }) {
	// Setups
	const authHeader = useAuthHeader()
	const { t } = useTranslation()
	const signOut = useSignOut()

	// States
	const [user, setUser] = useState<User_Response | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)

	// Functions
	function fetchUser() {
		console.log("Fetching user: " + _id)
		axios
			.get(`${API.baseURL}/users/${_id}`, { headers: { Authorization: _id == "me" ? authHeader : undefined } })
			.then((res) => {
				setUser(res.data)
				if (_id == "me" && res.data === null) {
					signOut()
					window.document.location.reload()
				}
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
					<div className="flex flex-col gap-2 rounded-lg p-3 border">
						{user.login && <p>{`${user.firstName} ${user.lastName}`}</p>}
						<p className="w-[140px] font-semibold">{user.login ? user.login : `${user.firstName} ${user.lastName}`}</p>

						<div className="grid w-fit grid-cols-1 grid-rows-2 gap-1.5">
							<Button className="flex w-full gap-1.5 bg-green-500 font-bold text-white" onClick={() => window.open("https://wa.me/" + user.phone.replace("+", ""), "_blank")}>
								{t("label.whatsapp")}
								<WhatsAppIcon size={18} color="white" />
							</Button>
							{!_id ||
								(_id === "me" && (
									<div className="grid grid-cols-2 grid-rows-1 gap-1.5">
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
