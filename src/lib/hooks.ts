import { useQuery } from "@tanstack/react-query"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { Pet_Response } from "./declarations"
import axios, { AxiosError } from "axios"
import { API } from "@config"
import { useEffect, useState } from "react"

const LOCAL = {
    liked: "_data_offline_liked",
} as const

export function useGetFavoritePets() {
    // States
    const [favoritePets, setFavoritePets] = useState<Pet_Response["_id"][]>([])

    // Setups
    const authHeader = useAuthHeader()

    const {
        data,
        error,
        isPending,
    } = useQuery<Pet_Response[], AxiosError>({
        queryKey: ["me", "pets", authHeader, "liked"],
        queryFn: () => axios.get(`${API.baseURL}/me/liked`, { headers: { Authorization: authHeader } }).then((res) => res.data),
        retry(failureCount, error) {
            if (error.response?.status === 401) {
                return false
            }
            return failureCount < 2
        },
    })


    function _fetchFavoritePetsLocalStorage() {
        const _favoritePets = localStorage.getItem(LOCAL.liked)
        if (_favoritePets) {
            return JSON.parse(_favoritePets) as Pet_Response["_id"][]
        }
        return []
    }

    useEffect(() => {
        const _favoritePets = _fetchFavoritePetsLocalStorage()
        setFavoritePets(() => [..._favoritePets, ...((data && data?.length > 0 && data?.map((pet) => pet._id)) || [])])
    }, [])

    return {
        data: favoritePets,
        error,
        isPending,
    }
}

export function useGetUserPets(user_id: string = "me") {
    // Setups
    const authHeader = useAuthHeader()
    if (!authHeader) {
        return {
            data: null,
            error: null,
            isPending: false,
        }
    }
    const {
        data,
        error,
        isPending,
    } = useQuery<Pet_Response[], AxiosError>({
        queryKey: [user_id, "pets", authHeader],
        queryFn: () => axios.get(`${API.baseURL}/${user_id}/pets`, { headers: { Authorization: authHeader } }).then((res) => res.data),
        retry(failureCount, error) {
            if (error.response?.status === 401) {
                return false
            }
            return failureCount < 2
        },
    })

    return {
        data,
        error,
        isPending,
    }
}