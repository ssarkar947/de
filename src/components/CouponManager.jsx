import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Percent, IndianRupee } from 'lucide-react';

export const CouponManager = () => {
  const { coupons, saveCoupon, toggleCouponStatus, deleteCoupon } = useApp();
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState(15);
  const [minOrder, setMinOrder] = useState(250);
  const [maxDiscount, setMaxDiscount] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    saveCoupon({
      code: code.trim().toUpperCase(),
      description: description || `${type === 'percentage' ? value + '% OFF' : 'Flat ₹' + value + ' OFF'}`,
      type,
      value: Number(value),
      minOrder: Number(minOrder),
      maxDiscount: Number(maxDiscount),
      active: true
    });
    setCode('');
    setDescription('');
  };

  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 16, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1b4332', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag size={22} color="#e5a024" />
            Backend Promotional Coupons & Offers Manager
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Create discount coupons for customers. Active coupons can be redeemed during checkout in "My Plate".
          </p>
        </div>
      </div>

      {/* Add Coupon Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: 18, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1f2937', marginBottom: 12 }}>Create New Promo Code</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Coupon Code *</label>
            <input
              type="text"
              placeholder="e.g. MONSOON25"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 800, textTransform: 'uppercase' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Discount Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700 }}
            >
              <option value="percentage">Percentage (%) Discount</option>
              <option value="flat">Flat Amount (₹) Discount</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>
              Discount Value ({type === 'percentage' ? '%' : '₹'})
            </label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Min Order Amount (₹)</label>
            <input
              type="number"
              value={minOrder}
              onChange={e => setMinOrder(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: 4 }}>Max Cap Limit (₹)</label>
            <input
              type="number"
              value={maxDiscount}
              onChange={e => setMaxDiscount(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontWeight: 700 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Brief Offer Description (e.g. 20% OFF on biryanis above ₹300)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
          />
          <button
            type="submit"
            style={{
              background: '#1b4332',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 8,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Plus size={16} />
            <span>Create Coupon</span>
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Code</th>
              <th style={{ padding: '12px 16px' }}>Offer Benefit</th>
              <th style={{ padding: '12px 16px' }}>Min Order</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '14px 16px', fontWeight: 900, color: '#1b4332' }}>
                  <span style={{ background: '#fefce8', border: '1px solid #fde047', padding: '4px 10px', borderRadius: 6, color: '#b45309' }}>
                    {c.code}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#334155' }}>
                  <strong>{c.type === 'percentage' ? `${c.value}% OFF` : `Flat ₹${c.value} OFF`}</strong>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#64748b' }}>{c.description}</span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{c.minOrder}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => toggleCouponStatus(c.code)}
                    style={{
                      background: c.active ? '#dcfce7' : '#fee2e2',
                      color: c.active ? '#15803d' : '#b91c1c',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {c.active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <span>{c.active ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => deleteCoupon(c.code)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                    title="Delete Coupon"
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
