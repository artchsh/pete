import React, { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"
import { Input } from "@/components/ui/input"
import { axiosAuth as axios, axiosErrorHandler, filterValues } from "@utils"
import { API } from "@config"
import LoadingSpinner from "@/components/loading-spinner"
import { Textarea } from "@/components/ui/textarea"
import ReactImageGallery from "react-image-gallery"
import { useToast } from "../ui/use-toast"
import { AuthState } from "@/lib/declarations"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import { CatIcon, DogIcon } from "../icons"

export function AddPetForm() {
	// Setups
	const { t } = useTranslation()
	const user = useAuthUser<AuthState>()
	const authHeader = useAuthHeader()
	const { toast } = useToast()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const formSchema = z.object({
		name: z.string().min(2, {
			message: "Pets name cant be shorter than 2 characters!",
		}),
		birthDate: z.string(),
		type: z.string(),
		sterilized: z.boolean().default(false),
		weight: z.string().transform((arg) => Number(arg)),
		sex: z.enum(["male", "female"]),
		description: z.string({ required_error: "Description is required!" }),
		breed: z.string().default(""),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			birthDate: "",
			type: "Cat",
			sterilized: false,
			weight: 0,
			sex: "male",
			description: "",
			breed: "",
		},
	})

	// States
	const [loadingState, setLoadingState] = useState<boolean>(false)
	const [files, setFiles] = useState<undefined | Blob[]>(undefined)
	const [images, setImages] = useState<never[]>([])
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [petType, setPetType] = useState<string>("cat")

	// Functions
	function submitNewPet(values: z.infer<typeof formSchema>) {
		if (user) {
			setLoadingState(true)
			const formData = new FormData()
			formData.append("name", values.name)
			formData.append("birthDate", `${values.birthDate}`)
			formData.append("description", values.description)
			formData.append("type", values.type)
			formData.append("sterilized", JSON.stringify(values.sterilized))
			formData.append("weight", JSON.stringify(Number(values.weight)))
			formData.append("sex", values.sex)
			formData.append("ownerID", user._id)
			formData.append("city", localStorage.getItem("_city") || "0")
			formData.append("breed", values.breed)
			if (files) {
				for (let i = 0; i < files.length; i++) {
					formData.append("images", files[i])
				}
			}
			axios
				.post(`${API.baseURL}/pets/add`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: authHeader,
					},
				})
				.then(() => {
					toast({ description: t("label.success") })
					setLoadingState(false)
					queryClient.invalidateQueries({
						queryKey: ["user", user._id, "pets"],
					})
					navigate("/pwa/profile")
					window.location.reload()
				})
				.catch(axiosErrorHandler)
		}
	}

	function checkImage(file: Blob | undefined) {
		if (file == undefined) {
			return ""
		}
		return URL.createObjectURL(file)
	}

	function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (currentPage === 9) {
			if (form.formState.errors) {
				toast({ title: t("notifications.formErrorsTitle"), description: t("notifications.formErrors"), duration: 50000 })
			}
			// @ts-expect-error Yandex Metrica function
			ym(96355513,"reachGoal","add-pet-submission")
			form.handleSubmit(submitNewPet)(event)
			return
		}

		nextStep(event)
	}

	function nextStep(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setCurrentPage((prev) => prev + 1)
	}

	function prevStep() {
		setCurrentPage((prev) => prev - 1)
	}

	useEffect(() => {
		const imagesObject: React.SetStateAction<never[]> = []
		files?.map((file) => {
			if (checkImage(file) != "") {
				imagesObject.push({
					original: checkImage(file),
					thumbnail: checkImage(file),
				} as never)
			}
		})
		setImages(imagesObject)
	}, [files])

	useEffect(() => {
		if (currentPage === 9) {
			setImages([])
		}
	}, [currentPage])

	return (
		<Form {...form}>
			<form onSubmit={onSubmit} className="flex w-full flex-col justify-around space-y-4">
				<AnimatePresence mode="wait">
					<motion.div layout>
						{currentPage === 1 && (
							<motion.div className="grid w-full items-center gap-1.5" key={"page1"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.name")}</FormLabel>
											<FormControl>
												<Input id="name" required {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 2 && (
							<motion.div className="grid w-full items-center gap-1.5" key={"page2"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="breed"
									render={({ field }) => (
										<>
											<FormItem>
												<FormLabel>{t("pet.breed")}</FormLabel>
												<FormControl>
													<Input id="breed" required {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
											<Button variant={"secondary"} type="button" onClick={() => field.onChange("Дворняга")} className="w-fit">
												{t("label.noBreed")}
											</Button>
										</>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 3 && (
							<motion.div className="grid w-full items-center gap-1.5" key={"page3"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.type.default")}</FormLabel>
											<div className="flex w-full justify-around">
												<button
													type="button"
													onClick={() => {
														field.onChange("cat")
														setPetType("cat")
													}}>
													<CatIcon size={100} color={petType === "cat" ? "black" : "grey"} />
													{/* {t("pet.type.cat")} */}
												</button>
												<button
													type="button"
													onClick={() => {
														field.onChange("dog")
														setPetType("dog")
													}}>
													<DogIcon size={100} color={petType === "dog" ? "black" : "grey"} />
													{/* {t("pet.type.dog")} */}
												</button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 4 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page4"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="birthDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.birthDate")}</FormLabel>
											<FormControl>
												<Input type="date" required {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 5 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page5"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="sex"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.sex.default")}</FormLabel>
											<Select required onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder={t("pet.sex")} />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{filterValues.sex.map((sex) => (
														<SelectItem key={sex} value={sex}>
															{t(`pet.sex.${sex}`)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 6 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page6"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="sterilized"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
											<FormControl>
												<Checkbox checked={field.value} onCheckedChange={field.onChange} />
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel>{t("pet.sterilized")}?</FormLabel>
											</div>
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 7 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page7"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.weight")}</FormLabel>
											<FormControl>
												<Input type="number" required {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 8 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page8"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("pet.description")}</FormLabel>
											<FormControl>
												<Textarea required {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</motion.div>
						)}
						{currentPage === 9 && (
							<motion.div className="grid h-full w-full items-center gap-1.5" key={"page9"} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<ReactImageGallery items={images} showFullscreenButton={false} showPlayButton={false} />
								<label htmlFor="picture">{t("pet.add.img")}</label>
								<Input
									id="picture"
									type="file"
									accept="image/png, image/jpeg, image/jpg"
									multiple
									required
									onChange={(event) => {
										const files = event.target.files ? Array.from(event.target.files) : []
										setFiles(files)
									}}
								/>
							</motion.div>
						)}
					</motion.div>
				</AnimatePresence>
				<AnimatePresence>
					<div className="flex gap-2">
						{currentPage > 1 && (
							<motion.div layout animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
								<Button type="button" variant="outline" onClick={prevStep}>
									{t("label.back")}
								</Button>
							</motion.div>
						)}
						<motion.div className="w-full" layout>
							<Button className="w-full" type="submit">
								{loadingState ? <LoadingSpinner /> : currentPage < 9 ? t("label.next") : t("pet.add.btn")}
							</Button>
						</motion.div>
					</div>
				</AnimatePresence>
				<div className="h-20"></div>
			</form>
		</Form>
	)
}
