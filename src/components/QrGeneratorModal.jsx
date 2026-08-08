import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QrCode, Printer, X, Copy, ExternalLink } from 'lucide-react';

export const QrGeneratorModal = () => {
  const { isQrModalOpen, setIsQrModalOpen, showToast } = useApp();
  const [tableNumber, setTableNumber] = useState('Counter-1');

  if (!isQrModalOpen) return null;

  const takeawayUrl = `${window.location.origin}${window.location.pathname}?mode=takeaway&table=${encodeURIComponent(tableNumber)}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(takeawayUrl)}&color=1b4332`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(takeawayUrl);
    showToast('Takeaway link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={() => setIsQrModalOpen(false)}>
      <div className="modal-card" style={{ maxWidth: 440, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode color="#1b4332" size={20} />
            <h3>Takeaway QR Code Generator</h3>
          </div>
          <button
            onClick={() => setIsQrModalOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: 24 }}>
          <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: 16 }}>
            Place this QR code on shop tables or front counter. Visiting customers can scan to instantly order takeaway!
          </p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 4 }}>
              Location / Spot Label:
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={e => setTableNumber(e.target.value)}
              placeholder="e.g. Table 4, Counter Main"
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
                fontWeight: '700',
                textAlign: 'center',
                outline: 'none',
                width: 200
              }}
            />
          </div>

          {/* Printable QR Container */}
          <div style={{
            background: '#fdfbf7',
            padding: 24,
            borderRadius: 16,
            border: '2px dashed #e5a024',
            margin: '0 auto 20px',
            maxWidth: 280
          }}>
            <img src="/logo.png" alt="Desi Eats" style={{ height: 36, marginBottom: 12, objectFit: 'contain' }} />
            <div style={{ background: 'white', padding: 12, borderRadius: 12, display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <img src={qrImageUrl} alt="Takeaway QR Code" style={{ width: 180, height: 180, display: 'block' }} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#1b4332', marginTop: 12 }}>
              SCAN TO ORDER TAKEAWAY
            </h4>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d85d27' }}>
              Spot: {tableNumber}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleCopyLink}
              style={{
                flex: 1,
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '10px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Copy size={16} />
              <span>Copy Link</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                flex: 1,
                background: '#1b4332',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Printer size={16} />
              <span>Print Sticker</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
