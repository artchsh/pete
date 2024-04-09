import React from "react"

export default function ErrorPage() {

    return (
        <button className="p-2 bg-white text-black" onClick={() => location.reload()}>
            Reload page
        </button>
    )
}