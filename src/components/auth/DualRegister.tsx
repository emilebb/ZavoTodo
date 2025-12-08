/**
 * ============================================
 * ZAVO - Dual Register Component
 * ============================================
 * 
 * Componente de registro que permite elegir entre Usuario o Negocio
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, 
  Store, 
  ArrowLeft, 
  Mail, 
  Lock,
  Phone,
  MapPin,
  FileText,
  Building2,
  Check
} from 'lucide-react'
import { RegisterUserData, RegisterBusinessData } from '../../types'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'

type RegistrationType = 'selection' | 'user' | 'business'

interface DualRegisterProps {
  onRegisterUser?: (data: RegisterUserData) => Promise<void>
  onRegisterBusiness?: (data: RegisterBusinessData) => Promise<void>
  loading?: boolean
}

const DualRegister: React.FC<DualRegisterProps> = ({
  onRegisterUser,
  onRegisterBusiness,
  loading = false
}) => {
  const [step, setStep] = useState<RegistrationType>('selection')
  const [userFormData, setUserFormData] = useState<RegisterUserData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    acceptTerms: false,
    acceptMarketing: false
  })
  const [businessFormData, setBusinessFormData] = useState<RegisterBusinessData>({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    address: '',
    category: '',
    description: '',
    nit: '',
    legalName: '',
    acceptTerms: false,
    acceptBusinessTerms: false
  })

  // ============================================
  // HANDLERS
  // ============================================

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onRegisterUser) {
      await onRegisterUser(userFormData)
    }
  }

  // const handleBusinessSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (onRegisterBusiness) {
  //     await onRegisterBusiness(businessFormData)
  //   }
  // }

  const updateUserForm = (field: keyof RegisterUserData, value: any) => {
    setUserFormData(prev => ({ ...prev, [field]: value }))
  }

  // const updateBusinessForm = (field: keyof RegisterBusinessData, value: any) => {
  //   setBusinessFormData(prev => ({ ...prev, [field]: value }))
  // }

  // ============================================
  // VALIDACIONES
  // ============================================

  const isUserFormValid = () => {
    return userFormData.name.trim() &&
           userFormData.email.trim() &&
           userFormData.password.length >= 6 &&
           userFormData.acceptTerms
  }

  // const isBusinessFormValid = () => {
  //   return businessFormData.adminName.trim() &&
  //          businessFormData.adminEmail.trim() &&
  //          businessFormData.adminPassword.length >= 6 &&
  //          businessFormData.businessName.trim() &&
  //          businessFormData.businessPhone.trim() &&
  //          businessFormData.address.trim() &&
  //          businessFormData.category &&
  //          businessFormData.acceptTerms &&
  //          businessFormData.acceptBusinessTerms
  // }

  // ============================================
  // RENDER SELECTION
  // ============================================

  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
        {/* Panel Izquierdo - Formulario */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ZAVO</span>
            </div>

            {/* Título */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Sign Up
              </h1>
              <p className="text-gray-600">
                Create your account to start saving food and money.
              </p>
            </div>

            {/* Opciones de Registro */}
            <div className="space-y-4">
              {/* Opción Usuario */}
              <button
                onClick={() => setStep('user')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Registrarme como Usuario
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quiero comprar packs sorpresa y ahorrar dinero
                    </p>
                  </div>
                </div>
              </button>

              {/* Opción Negocio */}
              <button
                onClick={() => setStep('business')}
                className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Store className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Registrarme como Negocio
                    </h3>
                    <p className="text-sm text-gray-600">
                      Quiero vender mis productos y reducir el desperdicio
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Link a Login */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Panel Derecho - Información */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-blue-700 items-center justify-center p-8">
          <div className="max-w-md text-white">
            {/* Logo en panel derecho */}
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Join the food rescue revolution
            </h2>
            <p className="text-purple-100 mb-8">
              Be part of the solution to food waste while saving money
            </p>

            {/* Beneficios */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-300 text-xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold">Save up to 70%</h3>
                  <p className="text-purple-200 text-sm">On quality food</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-300 text-xl">🌍</span>
                </div>
                <div>
                  <h3 className="font-semibold">Help the planet</h3>
                  <p className="text-purple-200 text-sm">Reduce food waste</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-orange-300 text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold">Quick & Easy</h3>
                  <p className="text-purple-200 text-sm">Find food near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER USER FORM
  // ============================================

  if (step === 'user') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => setStep('selection')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="text-lg font-bold text-gray-900">ZAVO</span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign Up
            </h1>
            <p className="text-gray-600">
              Create your account to start saving food and money.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUserSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => updateUserForm('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => updateUserForm('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => updateUserForm('password', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Create a password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={userFormData.acceptTerms}
                onChange={(e) => updateUserForm('acceptTerms', e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                required
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isUserFormValid() || loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
              size="lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account →'
              )}
            </Button>

            {/* Términos y condiciones */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-600 hover:text-purple-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-600 hover:text-purple-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // ============================================
  // CATEGORÍAS DE NEGOCIO
  // ============================================

  const businessCategories = [
    { value: 'restaurante', label: 'Restaurante', icon: '🍽️' },
    { value: 'panaderia', label: 'Panadería', icon: '🥖' },
    { value: 'cafe', label: 'Cafetería', icon: '☕' },
    { value: 'comida_rapida', label: 'Comida Rápida', icon: '🍔' },
    { value: 'supermercado', label: 'Supermercado', icon: '🛒' },
    { value: 'reposteria', label: 'Repostería', icon: '🧁' },
    { value: 'heladeria', label: 'Heladería', icon: '🍦' },
    { value: 'pizzeria', label: 'Pizzería', icon: '🍕' },
    { value: 'sushi', label: 'Sushi', icon: '🍣' },
    { value: 'otro', label: 'Otro', icon: '🏪' }
  ]

  // ============================================
  // HANDLERS BUSINESS
  // ============================================

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onRegisterBusiness) {
      await onRegisterBusiness(businessFormData)
    }
  }

  const updateBusinessForm = (field: keyof RegisterBusinessData, value: string | boolean) => {
    setBusinessFormData(prev => ({ ...prev, [field]: value }))
  }

  const isBusinessFormValid = () => {
    return businessFormData.adminName.trim() &&
           businessFormData.adminEmail.trim() &&
           businessFormData.adminPassword.length >= 6 &&
           businessFormData.businessName.trim() &&
           businessFormData.businessPhone.trim() &&
           businessFormData.address.trim() &&
           businessFormData.category &&
           businessFormData.acceptTerms &&
           businessFormData.acceptBusinessTerms
  }

  // ============================================
  // RENDER BUSINESS FORM
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => setStep('selection')}
            className="mr-4 p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registro de Negocio</h1>
            <p className="text-gray-600">Únete a ZAVO y reduce el desperdicio</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <form onSubmit={handleBusinessSubmit}>
            
            {/* Sección 1: Datos del Administrador */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Datos del Administrador</h2>
                  <p className="text-sm text-gray-500">Quien gestionará la cuenta</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={businessFormData.adminName}
                    onChange={(e) => updateBusinessForm('adminName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={businessFormData.adminPhone}
                      onChange={(e) => updateBusinessForm('adminPhone', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={businessFormData.adminEmail}
                      onChange={(e) => updateBusinessForm('adminEmail', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={businessFormData.adminPassword}
                      onChange={(e) => updateBusinessForm('adminPassword', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sección 2: Datos del Negocio */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Datos del Negocio</h2>
                  <p className="text-sm text-gray-500">Información de tu establecimiento</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del negocio *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={businessFormData.businessName}
                        onChange={(e) => updateBusinessForm('businessName', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Nombre de tu negocio"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono del negocio *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={businessFormData.businessPhone}
                        onChange={(e) => updateBusinessForm('businessPhone', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Teléfono de contacto"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={businessFormData.address}
                      onChange={(e) => updateBusinessForm('address', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Calle, número, ciudad"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {businessCategories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => updateBusinessForm('category', cat.value)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          businessFormData.category === cat.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{cat.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del negocio
                  </label>
                  <textarea
                    value={businessFormData.description}
                    onChange={(e) => updateBusinessForm('description', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    placeholder="Cuéntanos sobre tu negocio..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Datos Legales (Opcional) */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">Datos Legales</h2>
                  <p className="text-sm text-gray-500">Opcional - Puedes completarlo después</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIT
                  </label>
                  <input
                    type="text"
                    value={businessFormData.nit}
                    onChange={(e) => updateBusinessForm('nit', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="900.123.456-7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    value={businessFormData.legalName}
                    onChange={(e) => updateBusinessForm('legalName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Nombre legal de la empresa"
                  />
                </div>
              </div>
            </div>

            {/* Sección 4: Términos y Condiciones */}
            <div className="p-6">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={businessFormData.acceptTerms}
                      onChange={(e) => updateBusinessForm('acceptTerms', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      businessFormData.acceptTerms 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-300 group-hover:border-emerald-400'
                    }`}>
                      {businessFormData.acceptTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Acepto los{' '}
                    <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Términos y Condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Política de Privacidad
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={businessFormData.acceptBusinessTerms}
                      onChange={(e) => updateBusinessForm('acceptBusinessTerms', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      businessFormData.acceptBusinessTerms 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-gray-300 group-hover:border-emerald-400'
                    }`}>
                      {businessFormData.acceptBusinessTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Acepto los{' '}
                    <Link to="/business-terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Términos para Negocios
                    </Link>{' '}
                    y me comprometo a cumplir con las políticas de calidad de ZAVO
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isBusinessFormValid() || loading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Registrando negocio...
                  </>
                ) : (
                  <>
                    <Store className="w-5 h-5 mr-2" />
                    Registrar mi Negocio
                  </>
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ZAVO Business - Reduce el desperdicio, aumenta tus ingresos 💚
        </p>
      </div>
    </div>
  )
}

export default DualRegister
