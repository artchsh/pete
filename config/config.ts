const API: { baseURL: string } = {
	// @ts-expect-error vite
	baseURL: import.meta.env.VITE_API as string,
} as const

const main = {
	languages: [
		["ru", "🇷🇺 Русский"],
		["kz", "🇰🇿 Қазақ тілі"]
	]
} as const

export { API, main }
