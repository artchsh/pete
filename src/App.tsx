import React, { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import RequireAuth from "@auth-kit/react-router/RequireAuth"
import AuthProvider from "react-auth-kit/AuthProvider"
import createStore from "react-auth-kit/createStore"
import createRefresh from "react-auth-kit/createRefresh"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"

// Layouts
import PwaLayout from "./layouts/pwa"
import WebLayout from "./layouts/web"
import ProfileSkeleton from "./pages/skeletons/profile"
import SettingsSkeleton from "./pages/skeletons/settings"
import axios from "axios"
import { API } from "@config"
import UserSkeleton from "./pages/skeletons/user"

// pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import IndexPage from "./pages/web/Index"
import SupportPage from "./pages/web/Support"
import AboutUsPage from "./pages/web/AboutUs"

import MainPage from "./pages/pwa/Main"
const Settings = lazy(() => import("./pages/pwa/Settings"))

const UserPage = lazy(() => import("./pages/pwa/user/id"))
import PetsPage from "./pages/pwa/user/pets"
const ProfilePage = lazy(() => import("./pages/pwa/user/me"))

const AddPetPage = lazy(() => import("./pages/pwa/pet/add"))
import PetPage from "./pages/pwa/pet/id"
import ChangePet from "./pages/pwa/pet/change"
import ErrorBoundary from "./components/error-boundary"
import ErrorPage from "./pages/Error"
import GetStartedPage from "./pages/pwa/get-started"

const refresh = createRefresh({
	interval: 60 * 30 * 6, // The time in sec to refresh the Access token
	refreshApiCallback: async (param) => {
		try {
			const response = await axios.post(`${API.baseURL}/auth/refresh`, param, {
				headers: { Authorization: `Bearer ${param.authToken}` },
			})
			console.log("Refreshing")
			return {
				isSuccess: true,
				newAuthToken: response.data.token,
				newAuthTokenExpireIn: 60 * 60 * 60 * 60,
				newRefreshTokenExpiresIn: 31536000,
			}
		} catch (error) {
			console.error(error)
			return {
				isSuccess: false,
				newAuthToken: "",
				newAuthTokenExpireIn: 0,
				newRefreshTokenExpiresIn: 0,
			}
		}
	},
})

const store = createStore({
	authName: "_auth",
	authType: "localstorage",
	refresh,
})

const queryClient = new QueryClient()

function AnimatedRoutes() {
	const location = useLocation() // Get the current location

	return (
		<AnimatePresence mode="wait" onExitComplete={() => console.log("Exit complete")}>
			<ErrorBoundary fallback={<ErrorPage />}>
				<Routes location={location} key={location.pathname}>
					<Route element={<WebLayout />}>
						<Route path="/support" element={<SupportPage />} />
						<Route path="/" element={<IndexPage />} />
						<Route path="/about-us" element={<AboutUsPage />} />
					</Route>
					<Route path="/pwa/get-started" element={<GetStartedPage />} />
					<Route element={<PwaLayout />}>
						<Route path="/auth">
							<Route path="/auth/login" element={<Login />} />
							<Route path="/auth/register" element={<Register />} />
						</Route>
						<Route path="/pwa" element={<MainPage />} />
						<Route
							path="/pwa/profile"
							element={
								<Suspense fallback={<ProfileSkeleton />}>
									<ProfilePage />
								</Suspense>
							}
						/>
						<Route
							path="/pwa/settings"
							element={
								<Suspense fallback={<SettingsSkeleton />}>
									<Settings />
								</Suspense>
							}
						/>
						<Route
							path="/pwa/users/:userId"
							element={
								<Suspense fallback={<UserSkeleton />}>
									<UserPage />
								</Suspense>
							}
						/>
						<Route
							path="/pwa/users/:userId/pets"
							element={
								<Suspense fallback={<UserSkeleton />}>
									<PetsPage />
								</Suspense>
							}
						/>
						<Route
							path="/pwa/pets/:petId"
							element={
								<Suspense fallback={<UserSkeleton />}>
									<PetPage />
								</Suspense>
							}
						/>
						<Route path="/pwa/pets/:petId/change" element={<ChangePet />} />
						<Route
							path="/pwa/pets/add"
							element={
								<RequireAuth fallbackPath="/auth/login">
									<AddPetPage />
								</RequireAuth>
							}
						/>
					</Route>
				</Routes>
			</ErrorBoundary>
		</AnimatePresence>
	)
}

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider store={store}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<Router>
						<AnimatedRoutes />
					</Router>
				</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	)
}

export default App
