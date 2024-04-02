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
	geolocation: {
        latitude: number
        longitude:  number
    }
	createdAt: string
	updatedAt: string
}

export interface Pet_Filter {
	type?: string
	sterilized?: boolean
	sex?: "male" | "female" | ""
	weight?: number
	owner_type?: "private" | "shelter" | "breeder" | "nursery" | ""
}

export type User_Response = {
	_id: string
	companyName: string
	firstName: string
	lastName: string
	address: string
	show_address: boolean
	aboutMe: string
	phone: string
	type: "private" | "shelter" | "breeder" | "nursery"
	social: {
		telegram: string
		instagram: string
	}
	password: string
	liked: string[]
	token: string
	createdAt: string
	updatedAt: string
}

export interface AboutUsLanguage {
	text: {
		about_us: {
			label: string,
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
