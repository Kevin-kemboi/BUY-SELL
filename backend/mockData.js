// Simple in-memory mock data used when SKIP_DB=1 (no Mongo connection)
// Keep structure similar to actual Product documents consumed by the frontend

const now = new Date().toISOString();

const mockVariations = [
  { _id: 'var-color', type: 'Color', options: ['Red', 'Blue', 'Green'] },
  { _id: 'var-size', type: 'Size', options: ['S', 'M', 'L'] },
];

const mockProducts = [
  {
    _id: 'mock-1',
    name: 'Mock Phone',
    description: 'A placeholder smartphone available in offline mock mode.',
    price: 499,
    category: 'electronics',
    stock: 42,
    imageUrl: '/images/hero.png',
    createdAt: now,
    variations: mockVariations,
  },
  {
    _id: 'mock-2',
    name: 'Mock Headphones',
    description: 'Wireless headphones (mock data).',
    price: 129,
    category: 'audio',
    stock: 30,
    imageUrl: '/images/thumb.png',
    createdAt: now,
    variations: mockVariations,
  },
  {
    _id: 'mock-3',
    name: 'Mock Backpack',
    description: 'Durable urban backpack (mock).',
    price: 79,
    category: 'fashion',
    stock: 15,
    imageUrl: '/images/t2.png',
    createdAt: now,
    variations: mockVariations,
  },
];

module.exports = { mockProducts, mockVariations };
