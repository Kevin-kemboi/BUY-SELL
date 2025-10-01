// Mock data for offline / no-backend preview mode
export const mockVariations = [
  { _id: 'var-size', type: 'SIZE', options: ['S', 'M', 'L', 'XL'] },
  { _id: 'var-color', type: 'COLOR', options: ['Black', 'White', 'Red'] }
];

export const mockProducts = [
  {
    _id: 'prod-1',
    name: 'Mock Running Shoes',
    description: 'Lightweight breathable running shoes for daily training.',
    price: 3499,
    category: 'footwear',
    stock: 25,
    imageUrl: '/uploads/file-1725989771020.png',
    variations: mockVariations,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-2',
    name: 'Mock Smartwatch',
    description: 'Track your fitness and notifications on the go.',
    price: 5599,
    category: 'electronics',
    stock: 12,
    imageUrl: '/uploads/file-1725989839231.png',
    variations: mockVariations,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-3',
    name: 'Mock Cotton Hoodie',
    description: 'Soft premium cotton unisex hoodie.',
    price: 2899,
    category: 'mens',
    stock: 40,
    imageUrl: '/uploads/file-1725989882034.png',
    variations: mockVariations,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prod-4',
    name: 'Mock Wireless Earbuds',
    description: 'Noise-isolating earbuds with long battery life.',
    price: 2199,
    category: 'electronics',
    stock: 60,
    imageUrl: '/uploads/file-1725989697154.png',
    variations: mockVariations,
    createdAt: new Date().toISOString()
  }
];

export const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const makeMockResponse = (data) => ({ success: true, ...data });
