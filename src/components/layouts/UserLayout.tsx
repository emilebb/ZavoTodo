import { Outlet } from 'react-router-dom'
import UserNavbar from '../navigation/UserNavbar'
import UserBottomNav from '../navigation/UserBottomNav'

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Top Navigation */}
      <UserNavbar />
      
      {/* Main Content */}
      <main className="pb-20 pt-16">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <UserBottomNav />
    </div>
  )
}

export default UserLayout
