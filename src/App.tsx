import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import AuthLayout from './components/layouts/AuthLayout'
import MainLayout from './components/layouts/MainLayout'

// Auth Pages
import RoleSelection from './pages/auth/RoleSelection'

// Demo Pages
import DemoPage from './pages/DemoPage'
import MapDemo from './pages/MapDemo'
import Home from './pages/user/Home'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'

function App() {
  const { checkSession, loading, initialized, user } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/role" replace />} />
        <Route path="role" element={<RoleSelection />} />
      </Route>

      {/* Main App Routes with Fixed Navbar */}
      <Route path="/*" element={<MainLayout />}>
        <Route index element={user ? <Home /> : <DemoPage />} />
        <Route path="demo" element={<DemoPage />} />
        <Route path="mapa" element={<MapDemo />} />
        <Route path="home" element={<Home />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
