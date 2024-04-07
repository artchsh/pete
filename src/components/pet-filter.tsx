import React, { useState } from "react"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Pet_Filter } from "@/lib/declarations"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "./ui/checkbox"
import { useTranslation } from "react-i18next"
import { filterValues, defaultFilterValue } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { API } from "@config"
import { motion } from "framer-motion"

export default function PetFilter({ updateFilter, filter, children }: { updateFilter: (filter: Pet_Filter) => void; filter: Pet_Filter; children: React.ReactNode }) {
	// Setups
	const { t } = useTranslation()
	const { data: petBreeds, isPending: petBreedsPending } = useQuery<{ [key: string]: string[] }>({
		queryKey: ["petFilter"],
		queryFn: () => axios.get(`${API.baseURL}/pets/breeds`).then((res) => res.data),
	})

	// States
	const [type, setType] = useState<Pet_Filter["type"]>(filter.type)
	const [sterilized, setSterilized] = useState<Pet_Filter["sterilized"]>(filter.sterilized)
	const [sex, setSex] = useState<Pet_Filter["sex"] | string>(filter.sex)
	const [weight, setWeight] = useState<Pet_Filter["weight"]>(filter.weight || 0)
	const [ownerType, setOwnerType] = useState<Pet_Filter["owner_type"] | string>(filter.owner_type)
	const [breed, setBreed] = useState<string>(filter.breed)

	// Functions
	function onSubmit() {
		updateFilter({
			type,
			sterilized,
			sex: sex as Pet_Filter["sex"],
			weight,
			owner_type: ownerType as Pet_Filter["owner_type"],
			breed,
		})
	}

	function reset() {
		setType(defaultFilterValue.type)
		setSterilized(defaultFilterValue.sterilized)
		setSex(defaultFilterValue.sex)
		setWeight(defaultFilterValue.weight)
		setOwnerType(defaultFilterValue.owner_type)
		updateFilter({
			type: defaultFilterValue.type,
			sterilized: defaultFilterValue.sterilized,
			sex: defaultFilterValue.sex,
			weight: defaultFilterValue.weight,
			owner_type: defaultFilterValue.owner_type,
			breed: defaultFilterValue.breed,
		})
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>{children}</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Filter pets</DrawerTitle>
						<DrawerDescription>So you can find your ideal one!</DrawerDescription>
					</DrawerHeader>
					<div className="p-4 pb-0">
						<div className="grid space-y-4">
							<motion.div className="flex w-full gap-2">
								<div className="grid w-full gap-1.5">
									<Label htmlFor="">{t("pet.type.default")}</Label>
									<Select value={type} onValueChange={setType}>
										<SelectTrigger>
											<SelectValue placeholder={"None"} />
										</SelectTrigger>
										<SelectContent>
											{filterValues.type.map((typepet) => (
												<SelectItem key={typepet} value={typepet}>
													{t("pet.type." + typepet)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								{petBreedsPending && (
									<div className="grid w-full gap-1.5">
										<Label htmlFor="">{t("pet.ownerType")}</Label>
										<Select value={ownerType} onValueChange={setOwnerType}>
											<SelectTrigger>
												<SelectValue placeholder={"None"} />
											</SelectTrigger>
											<SelectContent>
												{filterValues.owner_type.map((ownerType) => (
													<SelectItem key={ownerType} value={ownerType}>
														{t("user.type." + ownerType)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</motion.div>
							<div className="flex w-full gap-2">
								<div className="grid w-full gap-1.5">
									<Label htmlFor="sex">{t("pet.sex.default")}</Label>
									<Select value={sex} onValueChange={setSex}>
										<SelectTrigger>
											<SelectValue placeholder={"None"} />
										</SelectTrigger>
										<SelectContent>
											{filterValues.sex.map((petSex) => (
												<SelectItem key={petSex} value={petSex}>
													{t("pet.sex." + petSex)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="grid w-full gap-1.5">
									<Label htmlFor="breed">{t("pet.breed")}</Label>
									<Select value={breed} onValueChange={setBreed}>
										<SelectTrigger>
											<SelectValue placeholder={"None"} />
										</SelectTrigger>
										<SelectContent>
											{petBreeds &&
												Object.keys(petBreeds).map((petType) => {
													return petBreeds[petType].map((breed) => (
														<SelectItem key={breed} value={breed}>
															{breed}
														</SelectItem>
													))
												})}
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex items-center space-x-2">
								<Label htmlFor="sterilized_checkbox">{t("pet.sterilized")}?</Label>
								<Checkbox
									id="sterilized_checkbox"
									checked={sterilized}
									onCheckedChange={(value) => {
										setSterilized((_) => (value !== "indeterminate" ? value : _))
									}}
								/>
							</div>
						</div>
					</div>
					<DrawerFooter className="flex w-full flex-row gap-1.5">
						<DrawerClose asChild>
							<Button className="w-full" onClick={onSubmit}>
								{t("label.apply")}
							</Button>
						</DrawerClose>
						<Button className="w-full" variant={"outline"} type="reset" onClick={reset}>
							{t("label.reset")}
						</Button>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
