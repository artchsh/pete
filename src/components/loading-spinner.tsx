import React from "react"
import { Loader2 } from "lucide-react"

export default function LoadingSpinner({ size = 6 }: { size?: number }) {
  return <Loader2 className={`animate-spin w-${size} h-${size}`} />
}
