export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Dishes', icon: 'Utensils' },
  { id: 'non-veg-combos', name: 'Non-Veg Combos', icon: 'Flame' },
  { id: 'veg-combos', name: 'Veg Combos', icon: 'Soup' },
  { id: 'healthy-combos', name: 'Healthy Combos', icon: 'Sparkles' },
  { id: 'rice-pulao', name: 'Rice & Pulao', icon: 'Utensils' },
  { id: 'chicken-dishes', name: 'Chicken Dishes', icon: 'Flame' },
  { id: 'paneer-dishes', name: 'Paneer Dishes', icon: 'Soup' },
  { id: 'breads', name: 'Breads', icon: 'Leaf' },
  { id: 'extras', name: 'Extras & Add-ons', icon: 'Sparkles' },
];

export const INITIAL_MENU = [
  // =========================================================================
  // 1. NON-VEG COMBOS
  // =========================================================================
  {
    id: 'de-nvc-01',
    name: 'Basanti Pulao + Kosha Chicken',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 240,
    prepTime: '15 mins',
    description: 'Fragrant sweet-scented golden Basanti Pulao paired with authentic Bengali slow-cooked spicy Kosha Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Kosha Gravy', price: 0 },
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 },
      { name: 'Add Extra Tossed Veggies (+₹39)', price: 39 }
    ]
  },
  {
    id: 'de-nvc-02',
    name: 'Veg Pulao + Kosha Chicken',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 185,
    prepTime: '15 mins',
    description: 'Aromatic long-grain vegetable pulao loaded with fresh garden veggies, served with rich spicy Kosha Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Kosha Gravy', price: 0 },
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-03',
    name: 'Naan + Kosha Chicken',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 195,
    prepTime: '12 mins',
    description: 'Soft tandoori butter naan served alongside tender, flavorful Bengali Kosha Chicken gravy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 },
      { name: 'Add Scrambled Eggs (+₹20)', price: 20 }
    ]
  },
  {
    id: 'de-nvc-04',
    name: 'Naan Poori + Kosha Chicken',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 215,
    prepTime: '12 mins',
    description: 'Fluffy golden fried naan pooris served with savory, rich slow-simmered Kosha Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-nvc-05',
    name: 'Naan + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 168,
    prepTime: '15 mins',
    description: 'Fresh tandoori naan accompanied by deep-roasted spiced Ghee Chicken cooked to perfection.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-nvc-06',
    name: 'Naan Poori + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 220,
    prepTime: '15 mins',
    description: 'Crispy puffed naan pooris served with flavor-packed Desi Ghee Roast Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-nvc-07',
    name: 'Basanti Pulao + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 260,
    prepTime: '15 mins',
    description: 'Classic Gobindobhog Basanti Pulao infused with ghee and saffron, paired with fiery Desi Ghee Roast Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-08',
    name: 'Veg Pulao + Ghee Roast Chicken',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: false,
    rating: 4.7,
    reviews: 145,
    prepTime: '15 mins',
    description: 'Mild spiced fragrant vegetable pulao served with succulent chicken pan-roasted in pure aromatic desi ghee.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-09',
    name: 'Naan + Postobata Chicken',
    category: 'non-veg-combos',
    price: 189,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 170,
    prepTime: '15 mins',
    description: 'Warm naan bread served with classic Bengali poppy seed (Posto) paste slow-simmered rich chicken delicacy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-nvc-10',
    name: 'Naan Poori + Postobata Chicken',
    category: 'non-veg-combos',
    price: 189,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 230,
    prepTime: '15 mins',
    description: 'Crispy golden naan poori paired with traditional creamy nutty Postobata Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-nvc-11',
    name: 'Basanti Pulao + Postobata Chicken',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: true,
    rating: 5.0,
    reviews: 280,
    prepTime: '15 mins',
    description: 'Signature sweet saffron Basanti Pulao served with royal, subtly spiced Postobata Chicken.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-12',
    name: 'Veg Pulao + Postobata Chicken',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 160,
    prepTime: '15 mins',
    description: 'Delicate vegetable pulao served with rich and aromatic Bengali poppy seed paste chicken curry.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-13',
    name: 'Basanti Pulao + Chicken Bharta',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 210,
    prepTime: '15 mins',
    description: 'Golden Basanti Pulao accompanied by creamy, shredded Kolkata style Dhaba Chicken Bharta topped with egg garnish.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Extra Tossed Veggies (+₹39)', price: 39 }
    ]
  },
  {
    id: 'de-nvc-14',
    name: 'Veg Pulao + Chicken Bharta',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: false,
    rating: 4.7,
    reviews: 135,
    prepTime: '15 mins',
    description: 'Flavorful garden vegetable pulao paired with Kolkata style shredded creamy spicy Chicken Bharta.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },
  {
    id: 'de-nvc-15',
    name: 'Naan + Chicken Bharta',
    category: 'non-veg-combos',
    price: 149,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 190,
    prepTime: '12 mins',
    description: 'Soft hot tandoori naan served with melt-in-mouth creamy minced Chicken Bharta.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-nvc-16',
    name: 'Naan Poori + Chicken Bharta',
    category: 'non-veg-combos',
    price: 179,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 205,
    prepTime: '12 mins',
    description: 'Puffed crispy naan pooris served alongside rich, luscious spiced Kolkata Chicken Bharta.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },

  // =========================================================================
  // 2. VEG COMBOS
  // =========================================================================
  {
    id: 'de-vc-01',
    name: 'Basanti Pulao + Shahi Paneer',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 210,
    prepTime: '15 mins',
    description: 'Golden fragrant Basanti Pulao served with royal Shahi Paneer cooked in a rich, creamy cashew-nut gravy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Grilled Paneer (+₹59)', price: 59 },
      { name: 'Add Boiled Chickpeas (+₹29)', price: 29 }
    ]
  },
  {
    id: 'de-vc-02',
    name: 'Veg Pulao + Shahi Paneer',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 175,
    prepTime: '15 mins',
    description: 'Long-grain aromatic vegetable pulao paired with mild, royal sweet-savory Shahi Paneer gravy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Grilled Paneer (+₹59)', price: 59 }
    ]
  },
  {
    id: 'de-vc-03',
    name: 'Naan + Shahi Paneer',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 155,
    prepTime: '12 mins',
    description: 'Soft tandoori naan accompanied by luscious royal Shahi Paneer in velvety cashew gravy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-vc-04',
    name: 'Naan Poori + Shahi Paneer',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 195,
    prepTime: '12 mins',
    description: 'Crispy fried golden naan pooris paired with delicate, rich royal Shahi Paneer.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-vc-05',
    name: 'Naan + Paneer Butter Masala',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 180,
    prepTime: '14 mins',
    description: 'Fresh butter naan served alongside succulent paneer cubes in creamy tomato-butter makhani gravy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-vc-06',
    name: 'Naan Poori + Paneer Butter Masala',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 225,
    prepTime: '14 mins',
    description: 'Golden puffed naan pooris served with all-time favorite rich Paneer Butter Masala.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-vc-07',
    name: 'Basanti Pulao + Paneer Butter Masala',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 245,
    prepTime: '15 mins',
    description: 'Saffron-sweet Basanti Pulao served with creamy, aromatic Paneer Butter Masala.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Tossed Veggies (+₹39)', price: 39 }
    ]
  },
  {
    id: 'de-vc-08',
    name: 'Veg Pulao + Paneer Butter Masala',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 140,
    prepTime: '15 mins',
    description: 'Aromatic vegetable pulao paired with rich, mild-spiced Paneer Butter Masala.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Boiled Chickpeas (+₹29)', price: 29 }
    ]
  },
  {
    id: 'de-vc-09',
    name: 'Naan + Posto Paneer',
    category: 'veg-combos',
    price: 189,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 150,
    prepTime: '15 mins',
    description: 'Warm naan bread served with traditional Bengali poppy seed paste (Posto) cooked fresh cottage cheese.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-vc-10',
    name: 'Naan Poori + Posto Paneer',
    category: 'veg-combos',
    price: 189,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 195,
    prepTime: '15 mins',
    description: 'Crispy naan pooris paired with classic nutty and aromatic Posto Paneer.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },
  {
    id: 'de-vc-11',
    name: 'Basanti Pulao + Posto Paneer',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 235,
    prepTime: '15 mins',
    description: 'Sweet aromatic Basanti Pulao served with authentic Bengali Posto Paneer delicacy.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Boiled Chickpeas (+₹29)', price: 29 }
    ]
  },
  {
    id: 'de-vc-12',
    name: 'Veg Pulao + Posto Paneer',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 155,
    prepTime: '15 mins',
    description: 'Wholesome vegetable pulao accompanied by rich, traditional Bengali Posto Paneer.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Tossed Veggies (+₹39)', price: 39 }
    ]
  },
  {
    id: 'de-vc-13',
    name: 'Basanti Pulao + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 180,
    prepTime: '14 mins',
    description: 'Traditional homestyle Bengali Paneer & potato curry cooked in mild cumin-ginger gravy, paired with Basanti Pulao.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Tossed Veggies (+₹39)', price: 39 }
    ]
  },
  {
    id: 'de-vc-14',
    name: 'Veg Pulao + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 130,
    prepTime: '14 mins',
    description: 'Fragrant vegetable pulao served with homestyle comforting Bengali Paneer Aloor Torkari.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Boiled Chickpeas (+₹29)', price: 29 }
    ]
  },
  {
    id: 'de-vc-15',
    name: 'Naan + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 149,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 140,
    prepTime: '12 mins',
    description: 'Hot soft naan served with comforting, flavorful Paneer and Potato curry.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan (+₹25)', price: 25 }
    ]
  },
  {
    id: 'de-vc-16',
    name: 'Naan Poori + Paneer Aloor Torkari',
    category: 'veg-combos',
    price: 179,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 170,
    prepTime: '12 mins',
    description: 'Crispy puffed naan pooris served with traditional spicy Bengali Paneer Aloor Torkari.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Naan Poori (+₹35)', price: 35 }
    ]
  },

  // =========================================================================
  // 3. HEALTHY COMBOS
  // =========================================================================
  {
    id: 'de-hc-01',
    name: 'Veg Rice with Desi Ghee Tossed Veggies + Grilled Chicken Breast + Sunny Side Up / Scrambled Eggs',
    category: 'healthy-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 290,
    prepTime: '15 mins',
    description: 'High-protein fitness platter with ghee tossed seasoned garden vegetables, tender grilled chicken breast, and choice of farm-fresh eggs over aromatic rice.',
    inStock: true,
    variations: [
      { name: 'With Sunny Side Up Egg', price: 199 },
      { name: 'With Scrambled Eggs', price: 199 }
    ],
    options: [
      { name: 'Extra Boiled Chickpeas (+₹29)', price: 29 },
      { name: 'Extra Grilled Chicken Breast (+₹59)', price: 59 }
    ]
  },
  {
    id: 'de-hc-02',
    name: 'Whole Wheat Naan Wrap with Ghee Tossed Veggies + Grilled Chicken + Sunny Side Up / Scrambled Eggs',
    category: 'healthy-combos',
    price: 199,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 265,
    prepTime: '15 mins',
    description: 'Wholesome 100% whole wheat wrap packed with protein-rich grilled chicken, farm-fresh eggs, and crisp ghee-sautéed veggies.',
    inStock: true,
    variations: [
      { name: 'With Sunny Side Up Egg', price: 199 },
      { name: 'With Scrambled Eggs', price: 199 }
    ],
    options: [
      { name: 'Extra Grilled Chicken (+₹59)', price: 59 }
    ]
  },
  {
    id: 'de-hc-03',
    name: 'Veg Rice with Desi Ghee Tossed Veggies + Grilled Paneer + Boiled Chickpeas',
    category: 'healthy-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 230,
    prepTime: '15 mins',
    description: 'Clean vegetarian power bowl featuring grilled paneer cubes, protein-packed boiled chickpeas, and ghee-tossed vegetables on rice.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Grilled Paneer (+₹59)', price: 59 },
      { name: 'Extra Boiled Chickpeas (+₹29)', price: 29 }
    ]
  },
  {
    id: 'de-hc-04',
    name: 'Whole Wheat Naan Wrap with Ghee Tossed Veggies + Grilled Paneer + Boiled Chickpeas',
    category: 'healthy-combos',
    price: 199,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 210,
    prepTime: '15 mins',
    description: 'Healthy high-fiber whole wheat wrap filled with juicy grilled paneer, seasoned boiled chickpeas, and fresh tossed greens.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Extra Grilled Paneer (+₹59)', price: 59 }
    ]
  },
  {
    id: 'de-hc-05',
    name: 'DesiEats Specials Chicken Pulao',
    category: 'healthy-combos',
    price: 99,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 320,
    prepTime: '12 mins',
    description: 'Signature DesiEats single portion light & aromatic spiced Chicken Pulao with tender juicy chicken piece.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 },
      { name: 'Add Tossed Veggies (+₹39)', price: 39 }
    ]
  },

  // =========================================================================
  // 4. INDIVIDUAL ITEMS: RICE & PULAO
  // =========================================================================
  {
    id: 'de-rp-01',
    name: 'Basanti Pulao',
    category: 'rice-pulao',
    price: 89,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 180,
    prepTime: '10 mins',
    description: 'Traditional Bengali golden sweet fragrant rice infused with pure ghee, whole spices, raisins, and cashews.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-rp-02',
    name: 'Veg Pulao',
    category: 'rice-pulao',
    price: 89,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 120,
    prepTime: '10 mins',
    description: 'Aromatic long-grain basmati rice cooked with fresh seasonal vegetables and delicate Indian spices.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-rp-03',
    name: 'Chicken Pulao',
    category: 'rice-pulao',
    price: 99,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 210,
    prepTime: '12 mins',
    description: 'Flavorful basmati rice cooked with tender marinated chicken pieces, whole spices, and desi ghee.',
    inStock: true,
    variations: [],
    options: [
      { name: 'Add Sunny Side Up Egg (+₹15)', price: 15 }
    ]
  },

  // =========================================================================
  // 5. INDIVIDUAL ITEMS: CHICKEN DISHES
  // =========================================================================
  {
    id: 'de-cd-01',
    name: 'Kosha Chicken',
    category: 'chicken-dishes',
    price: 99,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 250,
    prepTime: '15 mins',
    description: 'Authentic slow-cooked Bengali style spicy, thick dark Kosha Chicken gravy.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-cd-02',
    name: 'Ghee Roast Chicken (2 pcs)',
    category: 'chicken-dishes',
    price: 119,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 205,
    prepTime: '15 mins',
    description: 'Succulent 2 pcs chicken roasted in pure aromatic desi ghee with freshly ground coastal spices.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-cd-03',
    name: 'Postobata Chicken (2 pcs)',
    category: 'chicken-dishes',
    price: 129,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 190,
    prepTime: '15 mins',
    description: 'Traditional 2 pcs Bengali delicacy simmered in a creamy, velvety poppy seed paste with green chilies.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-cd-04',
    name: 'Chicken Bharta',
    category: 'chicken-dishes',
    price: 99,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 175,
    prepTime: '15 mins',
    description: 'Kolkata dhaba style shredded chicken cooked in a rich, buttery, spiced egg gravy.',
    inStock: true,
    variations: [],
    options: []
  },

  // =========================================================================
  // 6. INDIVIDUAL ITEMS: PANEER DISHES
  // =========================================================================
  {
    id: 'de-pd-01',
    name: 'Shahi Paneer',
    category: 'paneer-dishes',
    price: 99,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 165,
    prepTime: '14 mins',
    description: 'Tender cottage cheese cubes simmered in a royal, fragrant cashew-nut and cream gravy.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-pd-02',
    name: 'Paneer Butter Masala',
    category: 'paneer-dishes',
    price: 99,
    isVeg: true,
    isSpecial: true,
    rating: 4.8,
    reviews: 185,
    prepTime: '14 mins',
    description: 'Classic North Indian cottage cheese preparation in a silky, rich tomato and butter sauce.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-pd-03',
    name: 'Posto Paneer',
    category: 'paneer-dishes',
    price: 109,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 170,
    prepTime: '15 mins',
    description: 'Authentic Bengali preparation of soft paneer cooked in a delicately spiced poppy seed paste.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-pd-04',
    name: 'Paneer Aloor Torkari',
    category: 'paneer-dishes',
    price: 89,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 130,
    prepTime: '12 mins',
    description: 'Homestyle comforting Bengali curry with paneer cubes and baby potatoes in a spiced gravy.',
    inStock: true,
    variations: [],
    options: []
  },

  // =========================================================================
  // 7. INDIVIDUAL ITEMS: BREADS
  // =========================================================================
  {
    id: 'de-br-01',
    name: 'Naan',
    category: 'breads',
    price: 25,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 210,
    prepTime: '8 mins',
    description: 'Soft, oven-baked traditional tandoori flatbread.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-br-02',
    name: 'Naan Poori',
    category: 'breads',
    price: 35,
    isVeg: true,
    isSpecial: true,
    rating: 4.9,
    reviews: 240,
    prepTime: '8 mins',
    description: 'Deep-fried golden puffed naan poori, crispy on the outside and soft inside.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-br-03',
    name: 'Whole Wheat Wrap',
    category: 'breads',
    price: 85,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 110,
    prepTime: '10 mins',
    description: 'Healthy 100% whole wheat flatbread wrap.',
    inStock: true,
    variations: [],
    options: []
  },

  // =========================================================================
  // 8. EXTRAS & ADD-ONS
  // =========================================================================
  {
    id: 'de-ex-01',
    name: 'Sunny Side Up Egg',
    category: 'extras',
    price: 15,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 95,
    prepTime: '5 mins',
    description: 'Fresh farm egg fried sunny side up with a pinch of black pepper and sea salt.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-ex-02',
    name: 'Scrambled Eggs',
    category: 'extras',
    price: 20,
    isVeg: false,
    isSpecial: false,
    rating: 4.8,
    reviews: 80,
    prepTime: '6 mins',
    description: 'Fluffy, lightly seasoned scrambled eggs tossed in mild butter.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-ex-03',
    name: 'Grilled Chicken Breast',
    category: 'extras',
    price: 59,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 140,
    prepTime: '10 mins',
    description: 'Lean, juicy chicken breast fillet grilled with herbs and spices.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-ex-04',
    name: 'Grilled Paneer',
    category: 'extras',
    price: 59,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 115,
    prepTime: '10 mins',
    description: 'Golden grilled fresh paneer cubes seasoned with mild herbs.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-ex-05',
    name: 'Boiled Chickpeas',
    category: 'extras',
    price: 29,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 70,
    prepTime: '5 mins',
    description: 'High-protein seasoned boiled chickpeas tossed with fresh lemon and light spices.',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-ex-06',
    name: 'Tossed Veggies',
    category: 'extras',
    price: 39,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 105,
    prepTime: '8 mins',
    description: 'Garden-fresh crunchy vegetables lightly sautéed in pure desi ghee.',
    inStock: true,
    variations: [],
    options: []
  }
];
