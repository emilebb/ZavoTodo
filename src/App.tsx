import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts - Cargados inmediatamente (críticos para el shell)
import AuthLayout from './components/layouts/AuthLayout'
import MainLayout from './components/layouts/MainLayout'

// Components
import LoadingSpinner from './components/ui/LoadingSpinner'
import AuthGuard from './components/auth/AuthGuard'

// ============================================
// LAZY LOADED PAGES - Code Splitting
// Cada ruta se carga solo cuando el usuario navega a ella
// ============================================

// Auth Pages
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'))
const ModernLogin = lazy(() => import('./pages/auth/ModernLogin'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))
const BusinessOnboardingPage = lazy(() => import('./pages/BusinessOnboardingPage'))

// Main Pages - Lazy loaded para mejor performance inicial
const DemoPage = lazy(() => import('./pages/DemoPage'))
const MapDemo = lazy(() => import('./pages/MapDemo'))
const GoogleMapDemo = lazy(() => import('./pages/GoogleMapDemo'))
const Home = lazy(() => import('./pages/user/Home'))

// User Pages
const UserOrders = lazy(() => import('./pages/user/UserOrders'))
const PackDetail = lazy(() => import('./pages/user/PackDetail'))
const OrderConfirmed = lazy(() => import('./pages/user/OrderConfirmed'))
const OrderQR = lazy(() => import('./pages/user/OrderQR'))
const OrderQRView = lazy(() => import('./pages/user/OrderQRView'))
const ProfilePage = lazy(() => import('./pages/user/ProfilePage'))
const ExplorePage = lazy(() => import('./pages/user/ExplorePage'))

// Business Pages
const QRScanner = lazy(() => import('./pages/business/QRScanner'))
const BusinessDashboardPro = lazy(() => import('./pages/business/NewBusinessDashboard'))

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
  return (
    <Suspense fallback={<AppLoader />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={
            <AuthGuard requireAuth={false}>
              <Suspense fallback={<AppLoader />}>
                <ModernLogin />
              </Suspense>
            </AuthGuard>
          } 
        />
        
        <Route 
          path="/register" 
          element={
            <AuthGuard requireAuth={false}>
              <Suspense fallback={<AppLoader />}>
                <RegisterPage />
              </Suspense>
            </AuthGuard>
          } 
        />

        {/* Legacy Auth Routes */}
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

        {/* Onboarding Route */}
        <Route 
          path="/onboarding" 
          element={
            <Suspense fallback={<PageLoader />}>
              <OnboardingPage />
            </Suspense>
          } 
        />
        
        {/* Business Onboarding Route */}
        <Route 
          path="/negocio/onboarding" 
          element={
            <Suspense fallback={<PageLoader />}>
              <BusinessOnboardingPage />
            </Suspense>
          } 
        />

        {/* Protected Routes with MainLayout */}
        <Route 
          path="/*" 
          element={
            <AuthGuard requireAuth={true}>
              <MainLayout />
            </AuthGuard>
          }
        >
          {/* Home */}
          <Route 
            path="home" 
            element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            } 
          />
          
          {/* Public pages (accessible when authenticated) */}
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
            path="google-maps" 
            element={
              <Suspense fallback={<PageLoader />}>
                <GoogleMapDemo />
              </Suspense>
            } 
          />
          
          {/* User Routes */}
          <Route 
            path="explorar" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ExplorePage />
              </Suspense>
            } 
          />
          
          <Route 
            path="perfil" 
            element={
              <Suspense fallback={<PageLoader />}>
                <ProfilePage />
              </Suspense>
            } 
          />
          
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
            path="pedido/confirmado" 
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
          
          {/* Nueva ruta para ver QR del pedido */}
          <Route 
            path="pedido/:orderId" 
            element={
              <Suspense fallback={<PageLoader />}>
                <OrderQRView />
              </Suspense>
            } 
          />
          
          {/* Ruta para escáner QR (solo negocios) */}
          <Route 
            path="negocio/scanner" 
            element={
              <Suspense fallback={<PageLoader />}>
                <QRScanner />
              </Suspense>
            } 
          />
          
          {/* Dashboard Pro para negocios */}
          <Route 
            path="negocio/dashboard-pro" 
            element={
              <Suspense fallback={<PageLoader />}>
                <BusinessDashboardPro />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
