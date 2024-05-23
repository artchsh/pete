import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { Pet_Response } from "./declarations"
import axios from "axios"
import { API, LOCAL } from "@config"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import i18n from "@/i18"
import { axiosErrorHandler } from "./utils"

/**
 * Custom hook to fetch pet ids.
 * @returns An object containing the favorite pets data, error, and pending status.
 */
export function useGetFavoritePets() {
	// States
	const [favoritePets, setFavoritePets] = useState<Pet_Response["_id"][]>([])
	const [isPending, setIsPending] = useState<boolean>(true)

	function _fetchFavoritePetsLocalStorage() {
		const _favoritePets = localStorage.getItem(LOCAL.liked)
		if (_favoritePets) {
			return JSON.parse(_favoritePets) as Pet_Response["_id"][]
		}
		return []
	}

	useEffect(() => {
		const _favoritePets = _fetchFavoritePetsLocalStorage()
		setFavoritePets(() => [..._favoritePets])
		setIsPending(false)
	}, [])

	return {
		data: favoritePets,
		isPending,
	}
}

export function useGeoLocation() {
	// Setups
	const { toast } = useToast()
	// States
	const [geoLocation, setGeoLocation] = useState<GeolocationPosition>()

	useEffect(() => {
		navigator.permissions.query({ name: "geolocation" }).then((result) => {
			if (result.state === "granted") {
				navigator.geolocation.getCurrentPosition((position) => {
					setGeoLocation(position)
				})
			} else if (result.state === "prompt") {
				toast({ title: i18n.t("info.geoConsent.title"), description: i18n.t("info.geoConsent.description") })
				navigator.geolocation.getCurrentPosition((position) => {
					setGeoLocation(position)
				})
			} else if (result.state === "denied") {
				console.log("Geolocation is denied")
			}
			result.onchange = () => {
				console.log(result.state)
			}
		})
		navigator.geolocation.getCurrentPosition((position) => {
			setGeoLocation(position)
		})
	}, [])

	return geoLocation
}

export function useGetUserPets(user_id: string = "me") {
	// Setups
	const authHeader = useAuthHeader()
	if (!authHeader && user_id == "me") {
		return {
			data: null,
			isPending: false,
		}
	}

	// States
	const [pets, setPets] = useState<Pet_Response[] | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(false)

	// Fetch pets
	function fetchUser() {
		setLoading(true)
		axios.get(`${API.baseURL}/users/${user_id}/pets`, { headers: { Authorization: authHeader } }).then((res) => { setPets(res.data); setLoading(false) }).catch(axiosErrorHandler)
	}

	useEffect(() => {
		fetchUser()
	}, [])

	return {
		data: pets,
		isPending: loading,
	}
}
