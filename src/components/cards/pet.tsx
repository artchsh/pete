/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react"
import type { Pet_Response } from "@declarations"
import { formatAge } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export default function PetCard(props: Pet_Response) {
	// Setups
	const navigate = useNavigate()

	return (
		<>
			<div
				className="relative cursor-pointer"
				style={{
					aspectRatio: "3/4",
					overflow: "hidden",
					minWidth: "100%",
				}}
				onClick={() => {
					navigate(`/pwa/pets/${props._id}`)
				}}>
				<img
					className="rounded-lg"
					src={props.imagesPath[0]}
					alt={props.name}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				/>
				<div className="from-2% absolute bottom-0 left-0 flex h-full w-full items-end rounded-lg bg-gradient-to-t from-black to-transparent to-40% p-3">
					<div>
						<p className="text-2xl font-bold text-white">{props.name}</p>
						<p className="text-white">{formatAge(props.birthDate) as string}</p>
					</div>
				</div>
			</div>
		</>
	)
}
