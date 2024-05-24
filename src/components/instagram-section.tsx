import React from "react"

export default function InstagramSection({ login }: { login: string }) {
	return (
		
			<iframe className="overflow-y-hidden h-[426px] w-full border rounded-md" height={"fit"} src={`https://instagram.com/${login === undefined || login === "undefined" ? "pete.kazakhstan" : login}/embed`}></iframe>
		
	)
}
