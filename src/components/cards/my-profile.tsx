import React from "react"
import { User_Response } from "@declarations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosErrorHandler } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API } from "@config"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"

export default function UserProfileCard() {
	// Setups
	const authHeader = useAuthHeader()
	const { data: user, isPending: userPending } = useQuery<User_Response>({
		queryKey: ["me"],
		queryFn: () =>
			axios
				.get(`${API.baseURL}/me`, { headers: { Authorization: authHeader } })
				.then((res) => res.data)
				.catch(axiosErrorHandler),
	})

	return (
		<>
			{userPending && <div>Loading...</div>}
			{user && (
				<div className="flex gap-2 rounded-lg p-3 text-card-foreground shadow-sm">
					<div>
						<Avatar className="shadow-vertical-secondary h-[140px] w-[140px]">
							<AvatarImage src={"/images/pete-logo.svg"} alt={"PETE"} />
							<AvatarFallback>P</AvatarFallback>
						</Avatar>
						<p className="w-[140px] font-semibold mt-2">{user.companyName ? user.companyName : `${user.firstName} ${user.lastName}`}</p>
					</div>
					<div className="flex flex-col justify-between max-h-full">
						<div>
						<p>{user?.aboutMe}</p>
						{user?.show_address && <p>{user.address}</p>}
						</div>
						<div>
							{/* there should be a button to text/call Whatsapp */}
						</div>
					</div>
				</div>
			)}
		</>
	)
}
