import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MenuSection } from './components/MenuSection';
import { AdminDashboard } from './components/AdminDashboard';
import { KitchenApp } from './components/KitchenApp';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { Sparkles, MapPin, Phone, Heart } from 'lucide-react';

const MainContent = () => {
  const { activeTab, toastMessage } = useApp();

  if (activeTab === 'kitchen') {
    return <KitchenApp />;
  }

  return (
    <div className="app-container">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={18} color="#e5a024" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Dynamic View (Customer Menu vs Kitchen Admin Dashboard) */}
      {activeTab === 'customer' ? <MenuSection /> : <AdminDashboard />}

      {/* Modals & Overlays */}
      <LocationModal />
      <CartDrawer />
      <OrderTracker />

      {/* Footer with Official Brand Info & Phone Number */}
      <footer style={{ background: '#164324', color: 'white', padding: '40px 24px', marginTop: 'auto', borderTop: '4px solid #e5a024' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src="/logo.png" alt="Desi Eats" style={{ height: 48, objectFit: 'contain' }} />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'var(--font-brand)' }}>desieats.online</h4>
              <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>Rajarhat Food Delivery & Takeaway Goodness</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, fontSize: '0.9rem', opacity: 0.95, flexWrap: 'wrap', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="#e5a024" />
              Rajarhat Chowmatha / Chinar Park, Kolkata
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fde68a' }}>
              <Phone size={16} color="#e5a024" />
              📞 6291288522
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          © {new Date().getFullYear()} desieats.online. Made with <Heart size={12} color="#d85d27" fill="#d85d27" style={{ display: 'inline' }} /> for good food lovers.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
