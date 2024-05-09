/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useTranslation } from "react-i18next"
import { API, LOCAL } from "@config"
import { Pet_Filter, AuthState, Pet_Response } from "@declarations"
import { axiosAuth as axios, defaultFilterValue, axiosErrorHandler } from "@utils"
import { LucideCat, LucideDog, MoveLeft, MoveRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CarouselItem, Carousel, CarouselContent, CarouselApi } from "@/components/ui/carousel"
import { Filter } from "lucide-react"
import React, { useState, useEffect, useCallback, lazy } from "react"
import { toast } from "@/components/ui/use-toast"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated"
import { AxiosResponse } from "axios"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import PetCard from "@/components/cards/pet"
import { useNavigate } from "react-router-dom"

const PetFilter = lazy(() => import("@/components/pet-filter"))

export default function Main() {
	// Setups
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const authHeader = useAuthHeader()
	const user = useAuthUser<AuthState>()
	const navigate = useNavigate()

	// States
	const [allPets, setAllPets] = useState<Pet_Response[]>([])
	const [loadingPets, setLoadingPets] = useState<boolean>(true)
	const [api, setApi] = useState<CarouselApi>()
	const [current, setCurrent] = useState(0)
	const [page, setPage] = useState<number>(1)
	const [filter, setFilter] = useState<Pet_Filter>(defaultFilterValue)

	// Functions
	const buildQueryString = useCallback(
		(page: number): string => {
			const params = new URLSearchParams(filter as unknown as Record<string, string>).toString()
			const paginationParams = `page=${page}&limit=10`
			return `${paginationParams}&${params}`
		},
		[filter?.owner_type, filter?.sex, filter?.sterilized, filter?.type, filter?.weight],
	)

	const filterPets = useCallback(
		(pets: Pet_Response[]) => {
			if (!isAuthenticated) {
				const browserLiked = JSON.parse(localStorage.getItem("_data_offline_liked") || "[]") as string[]
				pets = pets.filter((pet) => !browserLiked.includes(pet._id))
			}
			return pets
		},
		[isAuthenticated, user],
	)

	const addNewPets = useCallback(
		(pets: Pet_Response[]): Pet_Response[] => {
			toast({ description: "Pets updated!" })
			const filteredNewPets = pets.filter((pet) => !allPets.find(({ _id }) => _id === pet._id))
			const combinedPets = [...allPets, ...filteredNewPets]
			// This checks if there are new pets to add and combines them with the existing pets.
			return combinedPets
		},
		[allPets, page],
	)

	const fetchPets = (page: number = 1, addNew: boolean = true) => {
		setLoadingPets(true)
		const queryString = buildQueryString(page)
		axios
			.get(`${API.baseURL}/pets/recommendations?${queryString}`, { headers: { Authorization: authHeader } })
			.then((res: AxiosResponse) => {
				let newPets: Pet_Response[] = res.data
				newPets = filterPets(newPets)
				if (addNew) {
					newPets = addNewPets(newPets)
				}
				setAllPets(newPets)
			})
			.catch(axiosErrorHandler)
			.finally(() => {
				setLoadingPets(false)
			})
	}

	function updateFilter(filter: Pet_Filter) {
		setFilter(() => filter)
	}

	useEffect(() => {
		if (current === allPets.length - 1 && allPets.length % 10 === 0) {
			setPage((prevPage) => prevPage + 1)
			fetchPets(allPets.length / 10 + 1)
			console.log("Fetch more pets")
		}
	}, [current])

	useEffect(() => {
		fetchPets(1, false)
	}, [filter?.owner_type, filter?.sex, filter?.sterilized, filter?.type, filter?.weight])

	useEffect(() => {
		if (api) {
			setCurrent(api.selectedScrollSnap())
			api.on("select", () => setCurrent(api.selectedScrollSnap()))
		}
	}, [api])

	useEffect(() => {
		if ((!localStorage.getItem(LOCAL.getStartedCompleted) || localStorage.getItem(LOCAL.getStartedCompleted) === "false" || !localStorage.getItem(LOCAL.userType)) && !isAuthenticated) {
			navigate("/pwa/get-started")
		}
		fetchPets()
	}, [])

	return (
		<>
			<PetFilter updateFilter={updateFilter} filter={filter}>
				<Button variant="link" className={"absolute right-0 top-0 z-50 m-2 p-2"}>
					<Filter className={"h-8 w-8"} />
				</Button>
			</PetFilter>
			<div className="flex h-screen w-full flex-col items-center justify-center p-4">
				<div className="max-w-md">
					{loadingPets && <p className="mb-2 w-full animate-pulse rounded-lg border bg-card p-4 font-semibold">{t("label.updatePets")}...</p>}
					{allPets.length > 0 ? (
						<>
							<Carousel setApi={setApi} className="mb-5" opts={{ loop: false }}>
								<CarouselContent>
									{allPets.map((pet) => (
										<CarouselItem key={pet._id}>
											<PetCard {...pet} _id={pet._id} />
										</CarouselItem>
									))}
								</CarouselContent>
							</Carousel>

							<div className="mt-2 flex w-full justify-center gap-2 px-3">
								<Button
									size={"icon"}
									variant={"secondary"}
									className="active:scale-95"
									disabled={allPets[current]._id === allPets[0]._id}
									onClick={() => {
										api?.scrollPrev()
									}}>
									<MoveLeft />
								</Button>
								<Button
									size={"icon"}
									variant={"secondary"}
									className="active:scale-95"
									disabled={allPets[current]._id === allPets[allPets.length - 1]._id}
									onClick={() => {
										api?.scrollNext()
									}}>
									<MoveRight />
								</Button>
							</div>
						</>
					) : (
						<NoMorePets />
					)}
				</div>
			</div>
		</>
	)
}

function NoMorePets() {
	const { t } = useTranslation()
	return (
		<Card className="flex flex-col items-center justify-center p-6 text-center">
			<h1 className="flex items-center gap-2 text-2xl font-bold text-orange-200">
				<LucideDog />
				{t("label.noPets")}
				<LucideCat />
			</h1>
			<p>{t("text.no_more_pets")}</p>
		</Card>
	)
}
