import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MenuSection } from './components/MenuSection';
import { AdminDashboard } from './components/AdminDashboard';
import { KitchenApp } from './components/KitchenApp';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTracker } from './components/OrderTracker';
import { AuthModal } from './components/AuthModal';
import { Sparkles, MapPin, Phone, Heart, Lock, ChefHat, Smartphone, ShieldCheck } from 'lucide-react';

const MainContent = () => {
  const { activeTab, toastMessage, requestProtectedView } = useApp();

  if (activeTab === 'kitchen') {
    return (
      <>
        <KitchenApp />
        <AuthModal />
      </>
    );
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
      <AuthModal />

      {/* Footer with Official Brand Info & Backend Staff Access */}
      <footer style={{ background: '#164324', color: 'white', padding: '40px 24px 30px', marginTop: 'auto', borderTop: '4px solid #e5a024' }}>
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

        {/* Backend & Admin Access Card for Mobile & Web */}
        <div style={{
          maxWidth: 1280,
          margin: '28px auto 0',
          padding: '16px 20px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          border: '1px solid rgba(229, 160, 36, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={20} color="#e5a024" />
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fde68a' }}>Staff & Admin Portal</span>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.8 }}>Mobile & Desktop Backend Access</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => requestProtectedView('admin')}
              style={{
                background: '#e5a024',
                color: '#164324',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <ChefHat size={15} /> Admin Portal
            </button>

            <button
              onClick={() => requestProtectedView('kitchen')}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Smartphone size={15} /> Kitchen App
            </button>
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
