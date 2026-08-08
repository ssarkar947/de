import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Tag, Utensils, AlertCircle } from 'lucide-react';

export const CategoryManager = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      icon: 'Utensils'
    });
    setNewCatName('');
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#164324', fontFamily: 'var(--font-brand)' }}>
            Category Manager
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Add or remove food categories. Changes instantly sync to the customer storefront.
          </p>
        </div>
      </div>

      {/* Form to Add New Category */}
      <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            type="text"
            placeholder="New Category Name (e.g., Rolls & Wraps, Beverages, Combos)"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.9rem' }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            background: '#164324',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-brand)'
          }}
        >
          <Plus size={18} /> Add Category
        </button>
      </form>

      {/* List of Existing Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              padding: 14,
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: cat.id === 'all' ? '#f0fdf4' : '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(229, 160, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={18} color="#164324" />
              </div>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#111827', fontFamily: 'var(--font-brand)' }}>{cat.name}</strong>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {cat.id}</p>
              </div>
            </div>

            {cat.id !== 'all' && (
              <button
                onClick={() => deleteCategory(cat.id)}
                title="Remove Category"
                style={{
                  background: '#fee2e2',
                  border: 'none',
                  color: '#ef4444',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
