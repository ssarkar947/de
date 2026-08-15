export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Combos', icon: 'Utensils' },
  { id: 'non-veg-combos', name: 'Non-Veg Combos', icon: 'Flame' },
  { id: 'veg-combos', name: 'Veg Combos', icon: 'Soup' },
  { id: 'healthy-combos', name: 'Healthy Combos', icon: 'Sparkles' },
];

export const INITIAL_MENU = [
  // ==================== NON-VEG COMBOS (₹199 FLAT) ====================
  // Group 1: Kosha Chicken Combos
  {
    id: 'de-nv-01',
    name: 'Basanti Pulao + Kosha Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 184,
    prepTime: '15 mins',
    description: 'Fragrant sweet-scented golden Basanti Pulao paired with authentic Bengali slow-cooked spicy Kosha Chicken.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Kosha Gravy Dip', price: 0 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-02',
    name: 'Veg Pulao + Kosha Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 142,
    prepTime: '15 mins',
    description: 'Aromatic long-grain vegetable pulao loaded with peas & carrots, served with rich spicy Kosha Chicken.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Kosha Gravy Dip', price: 0 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-03',
    name: 'Naan + Kosha Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 165,
    prepTime: '12 mins',
    description: 'Soft tandoori butter naan served alongside tender, flavorful Bengali Kosha Chicken gravy.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-04',
    name: 'Naan Poori + Kosha Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 198,
    prepTime: '12 mins',
    description: 'Fluffy golden fried naan pooris served with savory, rich slow-simmered Kosha Chicken.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 2: Ghee Roast Chicken Combos
  {
    id: 'de-nv-05',
    name: 'Basanti Pulao + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 210,
    prepTime: '15 mins',
    description: 'Classic Gobindobhog Basanti Pulao infused with ghee and saffron, paired with fiery Desi Ghee Roast Chicken.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-06',
    name: 'Veg Pulao + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.7,
    reviews: 134,
    prepTime: '15 mins',
    description: 'Mild spiced fragrant vegetable pulao served with succulent chicken pan-roasted in pure aromatic desi ghee.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-07',
    name: 'Naan + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 156,
    prepTime: '12 mins',
    description: 'Fresh tandoori naan accompanied by deep-roasted spiced Ghee Chicken cooked to perfection.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-08',
    name: 'Naan Poori + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 177,
    prepTime: '12 mins',
    description: 'Crispy puffed naan pooris served with flavor-packed Desi Ghee Roast Chicken.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 3: Postobata Chicken Combos
  {
    id: 'de-nv-09',
    name: 'Basanti Pulao + Postobata Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 5.0,
    reviews: 168,
    prepTime: '15 mins',
    description: 'A traditional royal pairing of fragrant Basanti Pulao with delicately spiced Bengali Postobata (poppy seed) chicken gravy.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-10',
    name: 'Veg Pulao + Postobata Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.7,
    reviews: 119,
    prepTime: '15 mins',
    description: 'Wholesome garden vegetable pulao served alongside creamy, nutty Bengali Posto Chicken curry.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-11',
    name: 'Naan + Postobata Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 128,
    prepTime: '12 mins',
    description: 'Fresh clay oven naan paired with rich, mild-spiced Postobata chicken delicacy.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-12',
    name: 'Naan Poori + Postobata Chicken',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 145,
    prepTime: '12 mins',
    description: 'Crispy fried naan pooris accompanied by exquisite poppy seed paste simmered chicken curry.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 4: Chicken Bharta Combos
  {
    id: 'de-nv-13',
    name: 'Basanti Pulao + Chicken Bharta',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 230,
    prepTime: '15 mins',
    description: 'Sweet scented Basanti Pulao served with Kolkata style creamy shredded Chicken Bharta enriched with boiled egg.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Extra Boiled Egg (+₹15)', price: 15 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-14',
    name: 'Veg Pulao + Chicken Bharta',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 172,
    prepTime: '15 mins',
    description: 'Flavored vegetable pulao paired with signature Kolkata shredded Chicken Bharta gravy.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Extra Boiled Egg (+₹15)', price: 15 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-15',
    name: 'Naan + Chicken Bharta',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 5.0,
    reviews: 290,
    prepTime: '12 mins',
    description: 'All-time favorite combo of soft butter naan dipped into rich, luscious Kolkata style Chicken Bharta.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Extra Boiled Egg (+₹15)', price: 15 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-nv-16',
    name: 'Naan Poori + Chicken Bharta',
    category: 'non-veg-combos',
    price: 199,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 185,
    prepTime: '12 mins',
    description: 'Crispy fried naan poori served alongside creamy, egg-garnished shredded Chicken Bharta.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Extra Boiled Egg (+₹15)', price: 15 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // ==================== VEG COMBOS (₹199 FLAT) ====================
  // Group 1: Shahi Paneer Combos
  {
    id: 'de-vg-01',
    name: 'Basanti Pulao + Shahi Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 194,
    prepTime: '15 mins',
    description: 'Sweet scented golden Basanti Pulao served with melt-in-mouth cottage cheese cubes in royal Shahi cashew gravy.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Shahi Gravy Dip', price: 0 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-02',
    name: 'Veg Pulao + Shahi Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 135,
    prepTime: '15 mins',
    description: 'Aromatic vegetable pulao served with velvety, mildly sweet and rich royal Shahi Paneer.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-03',
    name: 'Naan + Shahi Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 160,
    prepTime: '12 mins',
    description: 'Soft tandoori butter naan paired with royal Shahi Paneer cooked with dry fruits and cream.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-04',
    name: 'Naan Poori + Shahi Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 140,
    prepTime: '12 mins',
    description: 'Crispy fried naan pooris served alongside rich, creamy Shahi Paneer.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 2: Paneer Butter Masala Combos
  {
    id: 'de-vg-05',
    name: 'Basanti Pulao + Paneer Butter Masala',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 5.0,
    reviews: 245,
    prepTime: '15 mins',
    description: 'Saffron Basanti Pulao served with buttery tomato-cashew Paneer Butter Masala and fresh cream.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-06',
    name: 'Veg Pulao + Paneer Butter Masala',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 168,
    prepTime: '15 mins',
    description: 'Delicious vegetable pulao served with popular creamy Paneer Butter Masala.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-07',
    name: 'Naan + Paneer Butter Masala',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 215,
    prepTime: '12 mins',
    description: 'Soft tandoori butter naan served with velvety, richly spiced Paneer Butter Masala.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-08',
    name: 'Naan Poori + Paneer Butter Masala',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 152,
    prepTime: '12 mins',
    description: 'Golden puffed naan pooris served alongside luscious Paneer Butter Masala gravy.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 3: Posto Paneer Combos
  {
    id: 'de-vg-09',
    name: 'Basanti Pulao + Posto Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 180,
    prepTime: '15 mins',
    description: 'Authentic Bengali Basanti Pulao paired with fresh cottage cheese simmered in poppy seed paste (Posto).',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-10',
    name: 'Veg Pulao + Posto Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 125,
    prepTime: '15 mins',
    description: 'Long grain vegetable pulao served with nutty and aromatic Posto Paneer gravy.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-11',
    name: 'Naan + Posto Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 138,
    prepTime: '12 mins',
    description: 'Soft tandoori naan paired with comforting Bengali Posto Paneer cooked with green chilies.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-12',
    name: 'Naan Poori + Posto Paneer',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 147,
    prepTime: '12 mins',
    description: 'Fluffy golden naan pooris served with unique and traditional Posto Paneer curry.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // Group 4: Paneer Aloor Torkari Combos
  {
    id: 'de-vg-13',
    name: 'Basanti Pulao + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 188,
    prepTime: '15 mins',
    description: 'A nostalgic Bengali feast: sweet Basanti Pulao paired with homestyle Paneer and Potato curry (Dalna).',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-14',
    name: 'Veg Pulao + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 130,
    prepTime: '15 mins',
    description: 'Wholesome vegetable pulao served with spiced savory Paneer and tender potato chunks.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-15',
    name: 'Naan + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 144,
    prepTime: '12 mins',
    description: 'Hot butter naan served with classic homestyle Bengali Paneer Aloor Torkari.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Piece (+₹40)', price: 40 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },
  {
    id: 'de-vg-16',
    name: 'Naan Poori + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 199,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 156,
    prepTime: '12 mins',
    description: 'Puffed golden naan pooris paired with spiced Bengali Paneer and Potato curry.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 },
      { name: 'Add Green Salad & Onion (+₹20)', price: 20 },
      { name: 'Add Gulab Jamun (+₹30)', price: 30 }
    ]
  },

  // ==================== HEALTHY COMBOS (₹199 FLAT) ====================
  {
    id: 'de-hl-01',
    name: 'Veg Rice with Desi Ghee Tossed Veggies + Grilled Chicken Breast + Sunny Side Up / Scrambled Eggs',
    category: 'healthy-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 215,
    prepTime: '15 mins',
    description: 'High-protein fitness bowl: Fragrant vegetable rice, farm fresh veggies tossed in pure desi ghee, lean marinated grilled chicken breast, and your choice of freshly prepared egg.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Egg Prep: Sunny Side Up', price: 0 },
      { name: 'Egg Prep: Scrambled Eggs', price: 0 },
      { name: 'Extra Grilled Chicken Breast (+₹60)', price: 60 }
    ]
  },
  {
    id: 'de-hl-02',
    name: 'Whole Wheat Naan Wrap with Ghee Tossed Veggies + Grilled Chicken + Sunny Side Up / Scrambled Eggs',
    category: 'healthy-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 189,
    prepTime: '12 mins',
    description: 'Wholesome whole wheat naan roll packed with crisp desi ghee sauteed veggies, succulent herb grilled chicken strips, and freshly cooked eggs.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Egg Prep: Sunny Side Up', price: 0 },
      { name: 'Egg Prep: Scrambled Eggs', price: 0 },
      { name: 'Extra Mint Yogurt Dressing', price: 0 }
    ]
  },
  {
    id: 'de-hl-03',
    name: 'Veg Rice with Desi Ghee Tossed Veggies + Grilled Paneer + Boiled Chickpeas',
    category: 'healthy-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 174,
    prepTime: '15 mins',
    description: 'Nutrient-dense vegetarian power bowl: Flavored vegetable rice, seasonal veggies tossed in desi ghee, golden grilled malai paneer cubes, and fiber-packed protein boiled chickpeas.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Grilled Paneer Cubes (+₹50)', price: 50 },
      { name: 'Extra Boiled Chickpeas (+₹20)', price: 20 }
    ]
  },
  {
    id: 'de-hl-04',
    name: 'Whole Wheat Naan Wrap with Ghee Tossed Veggies + Grilled Paneer + Boiled Chickpeas',
    category: 'healthy-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 162,
    prepTime: '12 mins',
    description: 'Clean eating handcrafted wrap: Whole wheat naan filled with desi ghee tossed garden vegetables, seasoned grilled paneer, and spiced boiled chickpeas.',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Grilled Paneer (+₹50)', price: 50 },
      { name: 'Extra Mint Yogurt Dressing', price: 0 }
    ]
  }
];
