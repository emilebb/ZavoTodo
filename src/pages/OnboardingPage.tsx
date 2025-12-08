/**
 * ============================================
 * ZAVO - Onboarding Page
 * ============================================
 * 
 * Página de onboarding educativo
 */

import { useNavigate } from 'react-router-dom'
import OnboardingFlow from '../components/onboarding/OnboardingFlow'

const OnboardingPage = () => {
  const navigate = useNavigate()

  const handleComplete = () => {
    console.log('✅ Onboarding completado')
    navigate('/')
  }

  const handleSkip = () => {
    console.log('⏭️ Onboarding omitido')
    navigate('/')
  }

  return (
    <OnboardingFlow 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  )
}

export default OnboardingPage
