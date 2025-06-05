"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function CompleteLoadingScreen() {
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
      className={`flex h-screen w-full flex-col items-center justify-center bg-purple-900 transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <img src="/images/word-sanctuary-logo-black.png" alt="Word Sanctuary" className="w-64 h-auto" />
        <div className="relative h-0.5 w-64 bg-white/20 rounded-full">
          <div
            className="absolute left-0 top-0 h-full bg-white/80 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
