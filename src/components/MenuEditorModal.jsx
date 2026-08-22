import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Save, Sparkles, Utensils } from 'lucide-react';

export const MenuEditorModal = ({ item, itemToEdit, onClose }) => {
  const { saveMenuItem, categories } = useApp();
  const currentItem = item || itemToEdit;

  const [name, setName] = useState(currentItem?.name || '');
  const [category, setCategory] = useState(currentItem?.category || 'non-veg-combos');
  const [price, setPrice] = useState(currentItem?.price ?? 149);
  const [isVeg, setIsVeg] = useState(currentItem?.isVeg ?? false);
  const [isSpecial, setIsSpecial] = useState(currentItem?.isSpecial ?? false);
  const [prepTime, setPrepTime] = useState(currentItem?.prepTime || '15 mins');
  const [description, setDescription] = useState(currentItem?.description || '');

  // Portion Variations (e.g. Half / Full)
  const [variations, setVariations] = useState(currentItem?.variations || []);
  const [varNameInput, setVarNameInput] = useState('');
  const [varPriceInput, setVarPriceInput] = useState(149);

  // Add-on Options
  const [options, setOptions] = useState(currentItem?.options || []);
  const [optNameInput, setOptNameInput] = useState('');
  const [optPriceInput, setOptPriceInput] = useState(30);

  useEffect(() => {
    const target = item || itemToEdit;
    if (target) {
      setName(target.name || '');
      setCategory(target.category || 'non-veg-combos');
      setPrice(target.price ?? 149);
      setIsVeg(target.isVeg ?? false);
      setIsSpecial(target.isSpecial ?? false);
      setPrepTime(target.prepTime || '15 mins');
      setDescription(target.description || '');
      setVariations(target.variations || []);
      setOptions(target.options || []);
    } else {
      setName('');
      setCategory('non-veg-combos');
      setPrice(149);
      setIsVeg(false);
      setIsSpecial(false);
      setPrepTime('15 mins');
      setDescription('');
      setVariations([]);
      setOptions([]);
    }
  }, [item, itemToEdit]);

  const handleAddVariation = () => {
    if (!varNameInput.trim()) return;
    setVariations(prev => [...prev, { name: varNameInput.trim(), price: Number(varPriceInput) }]);
    setVarNameInput('');
    setVarPriceInput(150);
  };

  const handleRemoveVariation = (idx) => {
    setVariations(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddOption = () => {
    if (!optNameInput.trim()) return;
    setOptions(prev => [...prev, { name: optNameInput.trim(), price: Number(optPriceInput) }]);
    setOptNameInput('');
    setOptPriceInput(30);
  };

  const handleRemoveOption = (idx) => {
    setOptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const target = item || itemToEdit;

    saveMenuItem({
      id: target ? target.id : undefined,
      name: name.trim(),
      category,
      price: Number(price),
      isVeg,
      isSpecial,
      prepTime,
      description,
      inStock: target ? target.inStock : true,
      variations,
      options
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 660, maxHeight: '92vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Utensils color="#164324" size={20} />
            <h3>{currentItem ? `Edit Dish "${currentItem.name}"` : 'Add New Menu Dish'}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>Dish Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Basanti Pulao + Kosha Chicken"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontWeight: 700 }}
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>Base Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontWeight: 700 }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>Est. Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                placeholder="e.g. 15 mins"
                style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                <input type="checkbox" checked={isVeg} onChange={e => setIsVeg(e.target.checked)} />
                <span>Pure Veg Item</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                <input type="checkbox" checked={isSpecial} onChange={e => setIsSpecial(e.target.checked)} />
                <span>Chef Special Tag</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>
              Dish Description (Item details, ingredients, spices & aroma) *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the dish ingredients, preparation style, and accompaniments..."
              style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.88rem', resize: 'none' }}
              required
            />
          </div>

          {/* Portion Size Variations */}
          <div style={{ background: '#fdfbf7', padding: 16, borderRadius: 12, border: '1px solid #fef08a', marginBottom: 16 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#92400e', marginBottom: 8 }}>
              Portion Size Variations (e.g. Half / Full)
            </h4>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Variant Label (e.g. Half Portion)"
                value={varNameInput}
                onChange={e => setVarNameInput(e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={varPriceInput}
                onChange={e => setVarPriceInput(e.target.value)}
                style={{ width: 100, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={handleAddVariation}
                style={{ background: '#164324', color: 'white', border: 'none', padding: '0 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {variations.map((v, i) => (
                <div key={i} style={{ background: 'white', padding: '4px 10px', borderRadius: 20, border: '1px solid #cbd5e1', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong>{v.name}</strong> • ₹{v.price}
                  <button type="button" onClick={() => handleRemoveVariation(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Options */}
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#164324', marginBottom: 8 }}>
              Extra Add-ons & Customizations
            </h4>
            
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                placeholder="Add-on Name (e.g. Extra Cheese)"
                value={optNameInput}
                onChange={e => setOptNameInput(e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={optPriceInput}
                onChange={e => setOptPriceInput(e.target.value)}
                style={{ width: 100, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <button
                type="button"
                onClick={handleAddOption}
                style={{ background: '#164324', color: 'white', border: 'none', padding: '0 12px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
              >
                + Add
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {options.map((o, i) => (
                <div key={i} style={{ background: 'white', padding: '4px 10px', borderRadius: 20, border: '1px solid #cbd5e1', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <strong>{o.name}</strong> • +₹{o.price}
                  <button type="button" onClick={() => handleRemoveOption(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#164324',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 30,
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Save size={18} />
            <span>Save Dish to Menu</span>
          </button>
        </form>
      </div>
    </div>
  );
};
