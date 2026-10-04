import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export const CustomerImportModal = ({ onClose }) => {
  const { importCustomers, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [parsedCustomers, setParsedCustomers] = useState([]);
  const [parseError, setParseError] = useState('');

  const handleParse = () => {
    setParseError('');
    if (!inputText.trim()) {
      setParseError('Please paste customer data (CSV lines or JSON array)');
      return;
    }

    try {
      // First attempt JSON parse
      const trimmed = inputText.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const json = JSON.parse(trimmed);
        if (Array.isArray(json)) {
          const valid = json.map(item => {
            const phone = (item.phone || item.mobile || item.customerPhone || '').replace(/\D/g, '');
            if (phone.length < 10) return null;
            return {
              phone,
              name: item.name || item.customerName || 'Customer',
              address: item.address || '',
              pincode: item.pincode || '700135',
              email: item.email || '',
              ordersCount: Number(item.ordersCount || item.orders || 1),
              totalSpent: Number(item.totalSpent || item.spent || 0),
              notes: item.notes || 'Imported'
            };
          }).filter(Boolean);

          if (valid.length === 0) {
            setParseError('No valid customer records with 10-digit phone numbers found in JSON.');
            return;
          }
          setParsedCustomers(valid);
          return;
        }
      }

      // Second attempt: CSV line-by-line parse
      const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
      const customers = [];

      lines.forEach((line, index) => {
        // Skip header if line contains words like 'name' and 'phone'
        if (index === 0 && line.toLowerCase().includes('name') && line.toLowerCase().includes('phone')) {
          return;
        }

        const parts = line.split(/[,\t|]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length >= 2) {
          // Identify which part is phone
          let phonePart = '';
          let namePart = '';
          let addrPart = '';
          let pinPart = '700135';

          parts.forEach(p => {
            const clean = p.replace(/\D/g, '');
            if (clean.length === 10 && !phonePart) {
              phonePart = clean;
            } else if (!namePart && isNaN(Number(p))) {
              namePart = p;
            } else if (!addrPart && isNaN(Number(p))) {
              addrPart = p;
            } else if (clean.length === 6) {
              pinPart = clean;
            }
          });

          if (phonePart) {
            customers.push({
              phone: phonePart,
              name: namePart || 'Desi Customer',
              address: addrPart || 'Rajarhat Area',
              pincode: pinPart,
              ordersCount: 1,
              totalSpent: 200,
              notes: 'Imported via CSV'
            });
          }
        }
      });

      if (customers.length === 0) {
        setParseError('Could not identify valid phone numbers. Format: Name, Phone (10 digits), Address, Pincode');
        return;
      }

      setParsedCustomers(customers);
    } catch (e) {
      setParseError('Failed to parse: ' + e.message);
    }
  };

  const handleSaveImport = () => {
    if (parsedCustomers.length === 0) return;
    importCustomers(parsedCustomers);
    showToast(`🎉 Successfully imported ${parsedCustomers.length} customer records!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 620, maxHeight: '92vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(22, 67, 36, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={20} color="#164324" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164324', margin: 0, fontFamily: 'var(--font-brand)' }}>
                Import Old Customers Data
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: '2px 0 0' }}>
                Paste CSV or JSON list of existing customer contacts to load into CRM
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: '0.8rem', color: '#475569' }}>
            <strong>Supported formats:</strong>
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              <li>CSV: <code>Name, 10-Digit Mobile, Delivery Address, Pincode</code></li>
              <li>JSON: <code>[&#123; "name": "Rahul", "phone": "9830123456", "address": "Chinar Park" &#125;]</code></li>
            </ul>
          </div>

          {parseError && (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 14 }}>
              {parseError}
            </div>
          )}

          <textarea
            rows={6}
            placeholder={`Example:\nSourav Sarkar, 6291288522, Rajarhat Chowmatha, 700135\nRahul Roy, 9830123456, Chinar Park, 700136\nPriyanka M, 9874561230, Action Area 2, 700156`}
            value={inputText}
            onChange={e => { setInputText(e.target.value); setParsedCustomers([]); }}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.88rem', fontFamily: 'monospace', resize: 'vertical', marginBottom: 12 }}
          />

          <button
            type="button"
            onClick={handleParse}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #164324',
              background: '#f0fdf4',
              color: '#164324',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              marginBottom: 16
            }}
          >
            🔍 Preview & Validate Records
          </button>

          {parsedCustomers.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#164324', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#15803d" />
                Ready to Import {parsedCustomers.length} Customers:
              </div>
              <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fafafa' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                      <th style={{ padding: '6px 10px' }}>Name</th>
                      <th style={{ padding: '6px 10px' }}>Phone</th>
                      <th style={{ padding: '6px 10px' }}>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedCustomers.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '6px 10px' }}>📞 {c.phone}</td>
                        <td style={{ padding: '6px 10px', color: '#64748b' }}>{c.address} ({c.pincode})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              type="button"
              disabled={parsedCustomers.length === 0}
              onClick={handleSaveImport}
              style={{
                padding: '10px 22px',
                borderRadius: 8,
                border: 'none',
                background: parsedCustomers.length > 0 ? '#164324' : '#9ca3af',
                color: 'white',
                fontWeight: 700,
                cursor: parsedCustomers.length > 0 ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-brand)'
              }}
            >
              <Upload size={16} /> Save to Customer Database ({parsedCustomers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
