import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const PinCodeManager = () => {
  const { pincodes, addPincode, togglePincodeActive, removePincode } = useApp();
  const [newPin, setNewPin] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newTime, setNewTime] = useState('30-40 mins');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newPin || newPin.length !== 6 || !newArea) return;
    addPincode({
      pincode: newPin,
      area: newArea,
      avgDeliveryTime: newTime
    });
    setNewPin('');
    setNewArea('');
  };

  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1b4332', display: 'flex', alignItems: 'center', gap: 8 }}>
            <MapPin size={22} color="#d85d27" />
            Approved Delivery PIN Codes (Rajarhat & Sectors)
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Only orders placed with active PIN codes will be approved for delivery. Unapproved PINs fallback to Takeaway.
          </p>
        </div>
      </div>

      {/* Add New Pincode Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          maxLength={6}
          placeholder="PIN Code (e.g. 700135)"
          value={newPin}
          onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', width: 160, fontWeight: 700 }}
        />
        <input
          type="text"
          placeholder="Area Name (e.g. Rajarhat Main / Action Area II)"
          value={newArea}
          onChange={e => setNewArea(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', flex: 1, minWidth: 200 }}
        />
        <input
          type="text"
          placeholder="Avg Delivery Time"
          value={newTime}
          onChange={e => setNewTime(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', width: 150 }}
        />
        <button
          type="submit"
          style={{
            background: '#1b4332',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <Plus size={16} />
          <span>Add Zone</span>
        </button>
      </form>

      {/* Pincodes Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>PIN Code</th>
              <th style={{ padding: '12px 16px' }}>Location / Area</th>
              <th style={{ padding: '12px 16px' }}>Delivery Estimate</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pincodes.map(p => (
              <tr key={p.pincode} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 800, color: '#1b4332' }}>{p.pincode}</td>
                <td style={{ padding: '14px 16px', color: '#334155' }}>{p.area}</td>
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{p.avgDeliveryTime}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => togglePincodeActive(p.pincode)}
                    style={{
                      background: p.active ? '#dcfce7' : '#fef2f2',
                      color: p.active ? '#15803d' : '#b91c1c',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {p.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span>{p.active ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => removePincode(p.pincode)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                    title="Delete PIN Code"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
