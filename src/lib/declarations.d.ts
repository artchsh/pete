export type Pet_Response = {
	_id: string
	name: string
	birthDate: string
	type: string
	sterilized: boolean
	sex: "male" | "female"
	weight: number
	breed: string
	description: string
	ownerID: User_Response["_id"]
	imagesPath: string[]
	city: string
	price: number
	createdAt: string
	updatedAt: string
}

export interface Pet_Filter {
	type?: string
	sterilized?: boolean
	sex?: "male" | "female" | ""
	weight?: number
	owner_type?: "private" | "shelter" | "breeder" | ""
	breed: string
}

export type User_Response = {
	_id: string
	login: string
	firstName: string
	lastName: string
	phone: string
	type: "private" | "shelter" | "breeder"
	instagram: string
	password: string
	liked: string[]
	token: string
	refreshToken: string
	createdAt: string
	updatedAt: string
}

export interface AboutUsLanguage {
	text: {
		about_us: {
			label: string
			heading: string
			keys: [string, string][]
			conclusion: string
		}
	}
}

export type APIErrors = "userNotFound" | "userExists" | "wrongPassword" | "internal" | "noAuth"

export interface AuthState {
	_id: string
	phone: string
}
