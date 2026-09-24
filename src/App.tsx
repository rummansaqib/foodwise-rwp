import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import ToastContainer from './components/Toast';

import Home from './pages/user/Home';
import FindFood from './pages/user/FindFood';
import Restaurants from './pages/user/Restaurants';
import RestaurantDetails from './pages/user/RestaurantDetails';
import HealthProfile from './pages/user/HealthProfile';
import History from './pages/user/History';
import Favorites from './pages/user/Favorites';
import Account from './pages/user/Account';
import About from './pages/user/About';

import AdminDashboard from './pages/admin/Dashboard';
import RestaurantsAdmin from './pages/admin/RestaurantsAdmin';
import MenuManagement from './pages/admin/MenuManagement';
import UsersAdmin from './pages/admin/UsersAdmin';
import ReviewsAdmin from './pages/admin/ReviewsAdmin';
import RecommendationAnalytics from './pages/admin/RecommendationAnalytics';
import DataManagement from './pages/admin/DataManagement';
import Settings from './pages/admin/Settings';

function Shell() {
  const { role } = useApp();

  if (role === 'admin') {
    return (
      <div className="flex min-h-screen bg-cream">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/restaurants" element={<RestaurantsAdmin />} />
            <Route path="/admin/menus" element={<MenuManagement />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/reviews" element={<ReviewsAdmin />} />
            <Route path="/admin/analytics" element={<RecommendationAnalytics />} />
            <Route path="/admin/data" element={<DataManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find-food" element={<FindFood />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />
          <Route path="/health" element={<HealthProfile />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
