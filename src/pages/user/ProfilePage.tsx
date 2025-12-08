/**
 * ============================================
 * ZAVO - Profile Page
 * ============================================
 * 
 * Página de perfil del usuario
 */

import UserProfile from '../../components/profile/UserProfile'

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Mi Perfil
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <UserProfile />
      </div>
    </div>
  )
}

export default ProfilePage
