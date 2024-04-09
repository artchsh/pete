import React from "react"

export default function InstagramSection({ login }: { login: string }) {
	return (
		<div className="w-full rounded-lg bg-card p-4">
			<iframe className="no-scrollbar h-[400px] w-full rounded-lg" height={"fit"} src={`https://instagram.com/${login === undefined || login === "undefined" ? "pete.kazakhstan" : login}/embed`} frameBorder="0"></iframe>
		</div>
	)
}
