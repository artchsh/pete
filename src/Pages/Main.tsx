/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { Select, type SelectChangeEvent, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import PetCard from '@/Components/Cards/Pet.card'


const cities: string[] = ['Алматы', 'Астана', 'Шымкент']

export default function Main() {

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()

	// States
	const [institutions, setInstitutions] = useState<Pet_Response[]>([])
	const [petIndex, setPet] = useState<number>(0)
	const [city, setCity] = useState<string>('')

	// Handlers
	function changePet(type: 'n' | 'p') {
		if (type === 'n') {
			return petIndex != (institutions.length - 1) ? setPet(pet => pet + 1) : 0
		}
		return petIndex != 0 ? setPet(pet => pet - 1) : 0
	}

	// Functions
	function fetchInstitutions() {
		notification.custom.promise(
			axios.post(`${API.baseURL}/pets/find`, {}).then((res: AxiosResponse) => {
				if (!res.data.err) {
					setInstitutions(res.data)
				} else {
					notification.custom.error(res.data.err)
				}
			}),
		)
	}

	function checkToken() {
		const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
		const isEqualTokens = authHeader() == token
		if (!isEqualTokens) {
			signout()
		}
	}

	useEffect(() => {
		if (isAuthenticated()) {
			fetchInstitutions()
			checkToken()
		} else {
			navigate('/login')
		}
	}, [])

	return (
		<>
			{/* <m.div className="flex justify-center items-center flex-row mx-2 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<FormControl fullWidth style={{ marginTop: 8 }}>
					<InputLabel>{t('main.select_button_city')}</InputLabel>
					<Select
						value={city}
						label={t('main.select_button_city')}
						className="rounded-3xl"
						onChange={(event: SelectChangeEvent) => { setCity(event.target.value) }}
					>
						<MenuItem value="">{t('main.select_button_city_everything_option')}</MenuItem>
						{cities.map((_city: string) => (
							<MenuItem key={_city} value={_city}>{_city}</MenuItem>
						))}

					</Select>
				</FormControl>
			</m.div> */}

			<div className="flex justify-center flex-wrap">
				{institutions.map((pet, index: number) => (
					pet?.city?.includes(city) && (
						index === petIndex && (
							<PetCard
								key={index}
								imagesPath={pet.imagesPath}
								age={pet.age}
								type={pet.type}
								name={pet.name}
								description={pet.description}
								id={pet._id}
								userID={user._id}
								city={pet.city}
							/>
						)
					)

				))}
			</div>
			<div className='absolute bottom-20'>
				<div className='flex justify-between w-screen px-3'>
				<button className='bg-white p-2 text-black' onClick={() => { changePet('p')}}>prev</button>
				<button className='bg-white p-2 text-black' onClick={() => { changePet('n')}}>next</button>
				</div>
			</div>
		</>
	)
}
