/**
 * ============================================
 * ZAVO - Business Onboarding Page
 * ============================================
 */

import { useNavigate } from 'react-router-dom'
import BusinessOnboarding from '../components/onboarding/BusinessOnboarding'

const BusinessOnboardingPage = () => {
  const navigate = useNavigate()

  const handleComplete = () => {
    console.log('✅ Business onboarding completado')
    navigate('/negocio/dashboard-pro')
  }

  const handleSkip = () => {
    console.log('⏭️ Business onboarding omitido')
    navigate('/negocio/dashboard-pro')
  }

  return (
    <BusinessOnboarding 
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  )
}

export default BusinessOnboardingPage
