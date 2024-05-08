const API: { baseURL: string } = {
	// @ts-expect-error vite
	baseURL: (import.meta.env.VITE_API as string) || window.location.origin.split(":").slice(0, 2).join(":") + ":8000",
} as const

const main = {
	navLinks: [
		["navigation_main_bar.pages.main", "/"],
		["navigation_main_bar.pages.support", "/support"],
		["navigation_main_bar.pages.about_us", "/about-us"],
	],
	languages: [
		["ru", "🇷🇺 Русский"],
		["kz", "🇰🇿 Қазақ тілі"],
	],
} as const

const LOCAL = {
	liked: "_data_offline_liked",
	city: "_city",
	userType: "_userType",
	getStartedCompleted: "_getStartedCompleted",
	currentLanguage: "_currentLanguage",
	i18nLanguage: "i18nextLng"
} as const

export { API, main, LOCAL }
