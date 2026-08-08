export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Items', icon: 'Utensils' },
  { id: 'specials', name: 'Desi Specials', icon: 'Sparkles' },
  { id: 'biryani', name: 'Biryani & Rice', icon: 'Flame' },
  { id: 'starters', name: 'Starters & Rolls', icon: 'Sandwich' },
  { id: 'mains', name: 'Curries & Gravies', icon: 'Soup' },
  { id: 'breads', name: 'Tandoor & Breads', icon: 'Wheat' },
  { id: 'desserts', name: 'Sweets & Drinks', icon: 'Coffee' },
];

export const INITIAL_MENU = [
  {
    id: 'de-101',
    name: 'Kolkata Special Mutton Biryani',
    category: 'biryani',
    price: 340,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 142,
    prepTime: '20 mins',
    description: 'Aromatic basmati rice cooked over slow dum with succulent mutton piece, boiled egg, and luscious spiced potato infused with kewra & saffron.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Plate (1 Mutton + 1 Egg + 1 Aloo)', price: 230 },
      { name: 'Full Plate (2 Mutton + 1 Egg + 1 Aloo)', price: 340 },
      { name: 'Jumbo Special (3 Mutton + 2 Eggs + 2 Aloo)', price: 490 }
    ],
    options: [
      { name: 'Extra Mutton Piece (+₹150)', price: 150 },
      { name: 'Extra Biryani Aloo (+₹30)', price: 30 },
      { name: 'Add Raita (+₹40)', price: 40 },
    ]
  },
  {
    id: 'de-102',
    name: 'Royal Chicken Dum Biryani',
    category: 'biryani',
    price: 260,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 210,
    prepTime: '15 mins',
    description: 'Tender chicken piece marinated in yogurt and spices, layered with fragrant long-grain rice and classic Kolkata potato.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Plate (1 Chicken + 1 Aloo)', price: 170 },
      { name: 'Full Plate (2 Chicken + 1 Egg + 1 Aloo)', price: 260 },
    ],
    options: [
      { name: 'Extra Chicken Piece (+₹90)', price: 90 },
      { name: 'Extra Egg (+₹20)', price: 20 },
      { name: 'Add Burani Raita (+₹45)', price: 45 },
    ]
  },
  {
    id: 'de-103',
    name: 'Desi Butter Chicken Kosha',
    category: 'mains',
    price: 290,
    isVeg: false,
    isSpecial: true,
    rating: 4.9,
    reviews: 188,
    prepTime: '15 mins',
    description: 'Rich, velvety tomato and cashew gravy cooked with roasted chicken chunks, dollops of fresh butter and kasuri methi.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Portion (4 Pcs)', price: 180 },
      { name: 'Full Portion (8 Pcs)', price: 290 },
    ],
    options: [
      { name: 'Extra Gravy Portion (+₹50)', price: 50 },
      { name: 'Boneless Upgrade (+₹40)', price: 40 },
    ]
  },
  {
    id: 'de-104',
    name: 'Mutton Kosha (Bengali Style)',
    category: 'mains',
    price: 380,
    isVeg: false,
    isSpecial: true,
    rating: 5.0,
    reviews: 96,
    prepTime: '20 mins',
    description: 'Slow-cooked mutton gravy simmered in mustard oil with whole roasted spices, green chilies, and onion puree until dark and rich.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Portion (2 Pcs)', price: 240 },
      { name: 'Full Portion (4 Pcs)', price: 380 },
    ],
    options: [
      { name: 'Extra Spicy Level', price: 0 },
      { name: 'Mild Spice', price: 0 },
    ]
  },
  {
    id: 'de-105',
    name: 'Crispy Double Egg Chicken Roll',
    category: 'starters',
    price: 130,
    isVeg: false,
    isSpecial: false,
    rating: 4.7,
    reviews: 310,
    prepTime: '10 mins',
    description: 'Flaky paratha layered with fried eggs, stuffed with juicy grilled chicken tikka strips, crunchy onion rings, and secret spice mix.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Single Egg Roll', price: 90 },
      { name: 'Double Egg Chicken Roll', price: 130 },
      { name: 'Double Chicken Cheese Roll', price: 160 }
    ],
    options: [
      { name: 'Extra Cheese Slice (+₹25)', price: 25 },
      { name: 'No Green Chili', price: 0 },
    ]
  },
  {
    id: 'de-106',
    name: 'Paneer Butter Masala',
    category: 'mains',
    price: 240,
    isVeg: true,
    isSpecial: false,
    rating: 4.7,
    reviews: 115,
    prepTime: '15 mins',
    description: 'Soft cottage cheese cubes simmered in a mildly sweet cream and tomato gravy with aromatic spices.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Portion', price: 150 },
      { name: 'Full Portion', price: 240 }
    ],
    options: [
      { name: 'Extra Paneer (+₹60)', price: 60 },
    ]
  },
  {
    id: 'de-107',
    name: 'Smoky Tandoori Chicken',
    category: 'starters',
    price: 280,
    isVeg: false,
    isSpecial: true,
    rating: 4.8,
    reviews: 174,
    prepTime: '20 mins',
    description: 'Whole chicken bone-in legs marinated in spiced yogurt, roasted golden in charcoal clay tandoor. Served with mint chutney.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [
      { name: 'Half Tandoori (2 Pcs)', price: 280 },
      { name: 'Full Tandoori (4 Pcs)', price: 520 }
    ],
    options: [
      { name: 'Butter Glaze Spray (+₹20)', price: 20 },
    ]
  },
  {
    id: 'de-108',
    name: 'Butter Garlic Naan (2 Pcs)',
    category: 'breads',
    price: 90,
    isVeg: true,
    isSpecial: false,
    rating: 4.8,
    reviews: 260,
    prepTime: '8 mins',
    description: 'Traditional tandoori flatbread topped with minced fresh garlic, coriander, and brushed with melted pure ghee.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-109',
    name: 'Lachha Paratha (2 Pcs)',
    category: 'breads',
    price: 65,
    isVeg: true,
    isSpecial: false,
    rating: 4.6,
    reviews: 195,
    prepTime: '8 mins',
    description: 'Multi-layered flaky refined wheat bread baked to perfection on hot tawa.',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-110',
    name: 'Kolkata Special Gulab Jamun (2 Pcs)',
    category: 'desserts',
    price: 70,
    isVeg: true,
    isSpecial: false,
    rating: 4.9,
    reviews: 150,
    prepTime: '5 mins',
    description: 'Soft milk dumplings fried till golden amber, soaked in rose cardamom sugar syrup.',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: []
  },
  {
    id: 'de-111',
    name: 'Masala Kulhad Chai / Thandai',
    category: 'desserts',
    price: 50,
    isVeg: true,
    isSpecial: false,
    rating: 4.9,
    reviews: 220,
    prepTime: '5 mins',
    description: 'Traditional earthen pot brewed tea with ginger, cardamom & clove blend.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    variations: [],
    options: []
  }
];
