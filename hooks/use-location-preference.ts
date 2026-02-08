"use client"

import { useState, useEffect, useCallback } from "react"

const LOCATION_COOKIE_NAME = "trevo_preferred_location"
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year

interface LocationPreference {
  city: string
  district?: string
  province?: string
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()?.split(";").shift() || "")
  }
  return null
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function useLocationPreference() {
  const [location, setLocationState] = useState<LocationPreference | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = getCookie(LOCATION_COOKIE_NAME)
    if (stored) {
      try {
        setLocationState(JSON.parse(stored))
      } catch {
        setLocationState(null)
      }
    }
    setIsLoaded(true)
  }, [])

  const setLocation = useCallback((newLocation: LocationPreference | null) => {
    if (newLocation) {
      setCookie(LOCATION_COOKIE_NAME, JSON.stringify(newLocation), COOKIE_MAX_AGE)
      setLocationState(newLocation)
    } else {
      deleteCookie(LOCATION_COOKIE_NAME)
      setLocationState(null)
    }
  }, [])

  const clearLocation = useCallback(() => {
    deleteCookie(LOCATION_COOKIE_NAME)
    setLocationState(null)
  }, [])

  return {
    location,
    setLocation,
    clearLocation,
    isLoaded,
  }
}
