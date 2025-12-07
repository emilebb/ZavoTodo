import { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts - Cargados inmediatamente (críticos para el shell)
import AuthLayout from './components/layouts/AuthLayout'
import MainLayout from './components/layouts/MainLayout'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'

// ============================================
// LAZY LOADED PAGES - Code Splitting
// Cada ruta se carga solo cuando el usuario navega a ella
// ============================================

// Auth Pages
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'))

// Main Pages - Lazy loaded para mejor performance inicial
const DemoPage = lazy(() => import('./pages/DemoPage'))
const MapDemo = lazy(() => import('./pages/MapDemo'))
const Home = lazy(() => import('./pages/user/Home'))

// User Pages
const UserOrders = lazy(() => import('./pages/user/UserOrders'))
const PackDetail = lazy(() => import('./pages/user/PackDetail'))
const OrderConfirmed = lazy(() => import('./pages/user/OrderConfirmed'))
const OrderQR = lazy(() => import('./pages/user/OrderQR'))

/**
 * Loading Fallback Component
 * Se muestra mientras se carga una ruta lazy
 */
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-content-muted text-sm">Cargando...</p>
    </div>
  </div>
)

/**
 * Full Screen Loader
 * Para la carga inicial de la app
 */
const AppLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-teal-50 to-primary-50">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-content-muted">Preparando ZAVO...</p>
    </div>
  </div>
)

function App() {
  const { checkSession, loading, initialized, user } = useAuthStore()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (!initialized || loading) {
    return <AppLoader />
  }

  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/role" replace />} />
          <Route 
            path="role" 
            element={
              <Suspense fallback={<PageLoader />}>
                <RoleSelection />
              </Suspense>
            } 
          />
        </Route>

        {/* Main App Routes with Fixed Navbar */}
        <Route path="/*" element={<MainLayout />}>
          <Route 
            index 
            element={
              <Suspense fallback={<PageLoader />}>
                {user ? <Home /> : <DemoPage />}
              </Suspense>
            } 
          />
          <Route 
            path="demo" 
            element={
              <Suspense fallback={<PageLoader />}>
                <DemoPage />
              </Suspense>
            } 
          />
          <Route 
            path="mapa" 
            element={
              <Suspense fallback={<PageLoader />}>
                <MapDemo />
              </Suspense>
            } 
          />
          <Route 
            path="home" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            } 
          />
          
          {/* User Routes */}
          <Route 
            path="perfil/pedidos" 
            element={
              <Suspense fallback={<PageLoader />}>
                <UserOrders />
              </Suspense>
            } 
          />
          <Route 
            path="pack/:id" 
            element={
              <Suspense fallback={<PageLoader />}>
                <PackDetail />
              </Suspense>
            } 
          />
          <Route 
            path="pedido/:id/confirmado" 
            element={
              <Suspense fallback={<PageLoader />}>
                <OrderConfirmed />
              </Suspense>
            } 
          />
          <Route 
            path="pedido/:id/qr" 
            element={
              <Suspense fallback={<PageLoader />}>
                <OrderQR />
              </Suspense>
            } 
          />
        </Route>

        {/* Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
