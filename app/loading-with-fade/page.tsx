"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoadingScreenWithFade() {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(progress + 1)
      } else {
        setFadeOut(true)
        setTimeout(() => {
          router.push("/dashboard") // Navigate to your main page
        }, 1000)
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [progress, router])

  return (
    <div
      className={`flex h-screen w-full flex-col items-center justify-center bg-black transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-3xl font-bold text-white">ℬ</div>
        <div className="relative h-0.5 w-32 bg-white/20">
          <div
            className="absolute left-0 top-0 h-full bg-white/80 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
