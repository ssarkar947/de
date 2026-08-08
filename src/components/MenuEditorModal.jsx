import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Save, Sparkles, Utensils, Image as ImageIcon, Check } from 'lucide-react';

const FOOD_IMAGE_PRESETS = [
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chicken Biryani', url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Butter Chicken', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mutton Kosha', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chicken Roll', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80' },
  { name: 'Tandoori Chicken', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80' },
  { name: 'Paneer Butter', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Garlic Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' },
  { name: 'Gulab Jamun', url: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kulhad Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' }
];

export const MenuEditorModal = ({ itemToEdit, onClose }) => {
  const { saveMenuItem } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('biryani');
  const [price, setPrice] = useState(250);
  const [isVeg, setIsVeg] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [prepTime, setPrepTime] = useState('15 mins');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Portion Variations (e.g. Half / Full)
  const [variations, setVariations] = useState([]);
  const [varNameInput, setVarNameInput] = useState('');
  const [varPriceInput, setVarPriceInput] = useState(150);

  // Add-on Options
  const [options, setOptions] = useState([]);
  const [optNameInput, setOptNameInput] = useState('');
  const [optPriceInput, setOptPriceInput] = useState(30);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '');
      setCategory(itemToEdit.category || 'biryani');
      setPrice(itemToEdit.price || 250);
      setIsVeg(itemToEdit.isVeg ?? false);
      setIsSpecial(itemToEdit.isSpecial ?? false);
      setPrepTime(itemToEdit.prepTime || '15 mins');
      setDescription(itemToEdit.description || '');
      setImage(itemToEdit.image || '');
      setVariations(itemToEdit.variations || []);
      setOptions(itemToEdit.options || []);
    } else {
      setName('');
      setCategory('biryani');
      setPrice(250);
      setIsVeg(false);
      setIsSpecial(false);
      setPrepTime('15 mins');
      setDescription('');
      setImage(FOOD_IMAGE_PRESETS[0].url);
      setVariations([]);
      setOptions([]);
    }
  }, [itemToEdit]);

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

    saveMenuItem({
      id: itemToEdit ? itemToEdit.id : undefined,
      name: name.trim(),
      category,
      price: Number(price),
      isVeg,
      isSpecial,
      prepTime,
      description,
      image: image || FOOD_IMAGE_PRESETS[0].url,
      inStock: itemToEdit ? itemToEdit.inStock : true,
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
            <h3>{itemToEdit ? `Edit Dish "${itemToEdit.name}"` : 'Add New Menu Dish'}</h3>
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
                placeholder="e.g. Kolkata Special Mutton Biryani"
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
                <option value="biryani">Biryani & Rice</option>
                <option value="starters">Starters & Rolls</option>
                <option value="mains">Curries & Gravies</option>
                <option value="breads">Tandoor & Breads</option>
                <option value="desserts">Sweets & Drinks</option>
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

          {/* Image Editor & Presets Section */}
          <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#164324', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ImageIcon size={16} />
                Dish Image (URL or Presets)
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <input
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="Enter image URL..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem' }}
              />
              {image && (
                <img src={image} alt="Preview" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
              )}
            </div>

            {/* Quick Photo Presets */}
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6 }}>
              Quick Select Photo Preset:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {FOOD_IMAGE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImage(p.url)}
                  style={{
                    background: image === p.url ? '#164324' : 'white',
                    color: image === p.url ? 'white' : '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#374151', display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short appetizing description..."
              style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.85rem', resize: 'none' }}
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
