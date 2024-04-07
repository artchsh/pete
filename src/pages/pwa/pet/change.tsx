import BackButton from "@/components/back-button"
import ChangePetForm from "@/components/forms/change-pet"
import { AuthState } from "@/lib/declarations"
import React, { useEffect } from "react"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { useNavigate, useParams } from "react-router-dom"

export default function ChangePet() {
	const { petId } = useParams()
	const authState = useAuthUser<AuthState>()
	const navigate = useNavigate()

	useEffect(() => {
		if (!authState) {
			navigate("/auth/login")
		}
	}, [authState])

	return (
		<div className="m-4 mb-16 rounded-lg border bg-card p-4">
			<BackButton className="p-0" />
			{petId && <ChangePetForm pet_id={petId} />}
		</div>
	)
}
