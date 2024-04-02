/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, lazy, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { API } from "@config"
import { type Pet_Response, User_Response } from "@declarations"
import { axiosAuth as axios, calculateDistance } from "@utils"
import ReactImageGallery from "react-image-gallery"
import { formatAge } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useGeoLocation } from "@/lib/hooks"
const LikeButton = lazy(() => import("@/components/like-button"))

export default function PetPage() {
	// Setups
	const { petId } = useParams()
	const { t } = useTranslation()
    const geoLocation = useGeoLocation()
	const { data: pet } = useQuery<Pet_Response>({
		queryKey: ["pet", petId],
		queryFn: () => axios.get(`${API.baseURL}/pets/${petId}`).then((res) => res.data),
		enabled: !!petId,
	})
	const { data: ownerData } = useQuery<User_Response>({
		queryKey: ["owner", petId],
		queryFn: () => axios.get(`${API.baseURL}/users/${pet?.ownerID}`).then((res) => res.data),
		enabled: !!pet,
	})

	// States
	const [imageLinks, setImageLinks] = useState<{ original: string; thumbnail: string }[]>([])

	// function
	function formatImageLinks() {
		return (
			(pet &&
				pet.imagesPath.map((imageLink) => ({
					original: imageLink,
					thumbnail: imageLink,
				}))) ||
			[]
		)
	}

    function getDistance() {
		console.log(geoLocation, pet?.geolocation)
		
        return t("pet.noDistance")
    }

	useEffect(() => {
		setImageLinks(formatImageLinks())
	}, [pet])

	return (
		<div className="flex h-full w-full flex-col rounded-none border-none">
			<motion.div className="relative" layout>
				<Button size={"icon"} className="absolute left-6 top-6 z-[1] w-fit rounded-sm bg-white">
					<ArrowLeft />
				</Button>
				{pet && <LikeButton pet={pet} />}

				<ReactImageGallery additionalClass="" items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
			</motion.div>
			<div className="flex w-full justify-between p-6 pb-2">
                {pet ? 
                <div>
                    <p className="text-2xl font-semibold">{pet.name}</p> 
                    <p>{t("pet.distance")}: {getDistance()}</p>
                </div>
                : <p>Loading...</p>}
                </div>
			{pet && (
				<div className="flex h-[70px] min-h-[70px] snap-x gap-2 overflow-hidden overflow-x-auto text-black">
                    <div className="ml-6 flex flex-col items-center justify-center rounded-2xl bg-pink-200 p-2 px-4">
						<p className="text-nowrap font-semibold">{pet.breed}</p>
						<p className="text-pink-800/60">{t("pet.breed")}</p>
					</div>
					<div className="flex flex-col items-center justify-center rounded-2xl bg-pink-200 p-2 px-4">
						<p className="text-nowrap font-semibold">{t(`pet.sex.${pet.sex}`)}</p>
						<p className="text-pink-800/60">{t("pet.sex.default")}</p>
					</div>
					<div className="flex flex-col items-center justify-center rounded-2xl bg-red-200 p-2 px-4">
						<p className="text-nowrap font-semibold">{pet.sterilized ? t("label.yes") : t("label.no")}</p>
						<p className="text-red-800/60">{t("pet.sterilized")}</p>
					</div>
					<div className="flex flex-col items-center justify-center rounded-2xl bg-yellow-200 p-2 px-4">
						<p className="text-nowrap font-semibold">{`~${pet.weight} ${t("pet.kg")}`}</p>
						<p className="text-yellow-800/60">{t("pet.weight")}</p>
					</div>
					<div className="mr-6 flex flex-col items-center justify-center rounded-2xl bg-green-200 p-2 px-4">
						<p className="text-nowrap font-semibold">{formatAge(pet.birthDate) as string}</p>
						<p className="text-green-800/60">{t("pet.age")}</p>
					</div>
				</div>
			)}
			<div className="p-6 py-2">
				<pre className="mb-0 mt-3 rounded-lg bg-border p-3 font-sans font-normal">{pet && pet.description}</pre>
			</div>
			{ownerData && (
				<div className="mb-20 flex items-center justify-between gap-2 rounded-lg p-6 py-2 text-card-foreground shadow-sm">
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={"/images/pete-logo.svg"} alt={"PETE"} />
							<AvatarFallback>P</AvatarFallback>
						</Avatar>
						<p className="font-semibold">{ownerData.companyName ? ownerData.companyName : `${ownerData.firstName} ${ownerData.lastName}`}</p>
					</div>
					<Button className="h-full text-wrap">{t("btn.goProfile")}</Button>
				</div>
			)}
		</div>
	)
}
