import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, MapPin, Mail, Award, IndianRupee, Save, ShoppingBag } from 'lucide-react';

export const CustomerEditorModal = ({ customer, onClose }) => {
  const { saveCustomer } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('700135');
  const [email, setEmail] = useState('');
  const [ordersCount, setOrdersCount] = useState(1);
  const [totalSpent, setTotalSpent] = useState(250);
  const [qualifyingOrdersCount, setQualifyingOrdersCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setPincode(customer.pincode || '700135');
      setEmail(customer.email || '');
      setOrdersCount(customer.ordersCount ?? 1);
      setTotalSpent(customer.totalSpent ?? 250);
      setQualifyingOrdersCount(customer.qualifyingOrdersCount ?? 1);
      setNotes(customer.notes || '');
    } else {
      setName('');
      setPhone('');
      setAddress('');
      setPincode('700135');
      setEmail('');
      setOrdersCount(1);
      setTotalSpent(250);
      setQualifyingOrdersCount(1);
      setNotes('');
    }
  }, [customer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter customer name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    saveCustomer({
      phone: cleanPhone,
      name: name.trim(),
      address: address.trim(),
      pincode: pincode.trim() || '700135',
      email: email.trim(),
      ordersCount: Number(ordersCount) || 1,
      completedCount: Number(ordersCount) || 1,
      totalSpent: Number(totalSpent) || 0,
      qualifyingOrdersCount: Number(qualifyingOrdersCount) || 0,
      claimedRewardsCount: customer?.claimedRewardsCount || 0,
      notes: notes.trim(),
      lastOrderDate: customer?.lastOrderDate || new Date().toISOString(),
      joinedAt: customer?.joinedAt || new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 560, maxHeight: '92vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(22, 67, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="#164324" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164324', margin: 0, fontFamily: 'var(--font-brand)' }}>
                {customer ? 'Edit Customer Details' : 'Add New Customer to Database'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>
                Customer details are permanently preserved in the CRM database
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Sourav Sarkar"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Mobile / WhatsApp Number *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  placeholder="e.g. 9830123456"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  disabled={!!customer}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem', background: customer ? '#f3f4f6' : 'white' }}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Delivery Address *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Flat 3A, Greenwood Park, Rajarhat Chowmatha"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Pincode
              </label>
              <input
                type="text"
                placeholder="700135"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="customer@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Orders Count
              </label>
              <input
                type="number"
                min="0"
                value={ordersCount}
                onChange={e => setOrdersCount(e.target.value)}
                style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Lifetime Spend (₹)
              </label>
              <input
                type="number"
                min="0"
                value={totalSpent}
                onChange={e => setTotalSpent(e.target.value)}
                style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                Stamps (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={qualifyingOrdersCount % 5}
                onChange={e => setQualifyingOrdersCount(Number(e.target.value))}
                style={{ width: '100%', padding: '9px 10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
              Internal Notes / Tags
            </label>
            <input
              type="text"
              placeholder="e.g. VIP Customer, Frequent Kosha Chicken order"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                color: '#4b5563',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: '#164324',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-brand)'
              }}
            >
              <Save size={16} /> Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
