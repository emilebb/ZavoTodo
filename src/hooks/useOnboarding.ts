/**
 * ============================================
 * ZAVO - useOnboarding Hook
 * ============================================
 * 
 * Hook para manejar el estado del onboarding
 */

import { useState, useEffect, useCallback } from 'react'

const ONBOARDING_KEY = 'zavo_onboarding_completed'

export const useOnboarding = () => {
  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    return localStorage.getItem(ONBOARDING_KEY) === 'true'
  })
  const [shouldShow, setShouldShow] = useState<boolean>(false)

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY) === 'true'
    setIsCompleted(completed)
    setShouldShow(!completed)
  }, [])

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsCompleted(true)
    setShouldShow(false)
  }, [])

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY)
    setIsCompleted(false)
    setShouldShow(true)
  }, [])

  const skipOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsCompleted(true)
    setShouldShow(false)
  }, [])

  return {
    isCompleted,
    shouldShow,
    completeOnboarding,
    resetOnboarding,
    skipOnboarding
  }
}

export default useOnboarding
