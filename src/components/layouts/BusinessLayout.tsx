import { Outlet } from 'react-router-dom'
import BusinessNavbar from '../navigation/BusinessNavbar'
import BusinessSidebar from '../navigation/BusinessSidebar'

const BusinessLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Top Navigation */}
      <BusinessNavbar />
      
      <div className="flex pt-16">
        {/* Sidebar */}
        <BusinessSidebar />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BusinessLayout
