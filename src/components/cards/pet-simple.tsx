import React, { useEffect, useState } from "react"
import { Pet_Response } from "@/lib/declarations"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { API, LOCAL } from "@config"

export default function SimplePetCard({ pet, fetchById, petId }: { pet?: Pet_Response, fetchById?: boolean, petId?: string}) {
    // Setups
	const navigate = useNavigate()
    const [fetchedPet, setFetchedPet] = useState<Pet_Response>()

    // Functions
    function fetchPet() {
        if (!fetchById || pet?._id) {
            setFetchedPet(pet)
        } else {
            axios.get(`${API.baseURL}/pets/${petId}`).then((res) => {
                const petData = res.data
                if (petData === null) {
                    console.warn("No pet fonund with id: " + petId)
                    console.warn("Deleting pet from local storage")
                    let likedPets = JSON.parse(localStorage.getItem(LOCAL.liked) || "[]") as string[]
                    if (petId && likedPets.includes(petId)) {
                        likedPets = likedPets.filter((likedPet) => likedPet != petId)
                        localStorage.setItem(LOCAL.liked, JSON.stringify(likedPets))
                    }
                    console.warn("Deleted pet from local storage - " + petId)
                    console.warn("Reloading page")
                    window.location.reload()
                }
                setFetchedPet(res.data)
            })
        }
    }
    
    useEffect(() => {
        fetchPet()
    }, [])

	return fetchedPet && (
        <div
			onMouseDown={() => {
				navigate(`/pwa/pets/${fetchedPet._id}`)
			}}
			key={fetchedPet._id}
			className="cursor-pointer rounded-md border p-2">
			<img style={{ overflow: "hidden", maxWidth: "100%" }} className="w-full rounded-[.5rem]" src={(fetchedPet.imagesPath || [""])[0]} alt={`Изображение ${fetchedPet.name}`} />
			<p className="font-bold">{fetchedPet.name}</p>
		</div>
    )
}
