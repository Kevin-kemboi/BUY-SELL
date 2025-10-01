require("dotenv").config();
const express = require("express");
const cors = require("cors");

const SKIP_DB = process.env.SKIP_DB === '1';
if (!SKIP_DB) {
  // Lazy-load the Mongo connection only when needed to avoid pulling in mongoose in mock mode
  const connectTOMongo = require("./db");
  connectTOMongo();
} else {
  console.log('[server] SKIP_DB=1 detected — running in mock in-memory mode (no mongoose loaded).');
}

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
// TODO: Replace with the actual deployed frontend domain for Buy & Sell
app.use(cors({
  origin: [process.env.FRONTEND_ORIGIN || "http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));

app.get('/health', (req, res) => {
  res.json({ ok: true, dbSkipped: SKIP_DB });
});
if (SKIP_DB) {
  const { mockProducts, mockVariations } = require('./mockData');
  // Products list (with optional filter/sort headers like real route)
  app.get('/admin/productslist', (req, res) => {
    const filter = req.header('Filter');
    const sort = req.header('Sort');
  let list = [...mockProducts];
  if (filter) list = list.filter(p => p.category === filter);
  if (sort === 'high') list.sort((a,b)=> b.price - a.price);
    else if (sort === 'low') list.sort((a,b)=> a.price - b.price);
    else if (sort === 'latest') list.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    res.json({ success: true, products: list, totalCount: list.length });
  });

  // Single product by id
  app.post('/admin/getproductbyid', (req, res) => {
    const { id } = req.body || {};
    const product = mockProducts.find(p => p._id === id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found (mock)' });
    res.json({ success: true, product });
  });

  // Variations
  app.get('/variations', (req, res) => {
    res.json({ success: true, variations: mockVariations });
  });

  // Basic search placeholder
  app.post('/search', (req, res) => {
    const { query } = req.body || {};
    const results = query ? mockProducts.filter(p => p.name.toLowerCase().includes(String(query).toLowerCase())) : [];
    res.json({ success: true, results });
  });
} else {
  app.use("/admin", require("./routes/productRoutes"));
  app.use("/admin", require("./routes/adminRoutes"));
  app.use("/", require("./routes/searchRoute"));
  app.use("/user", require("./routes/userRoutes"));
  app.use("/cart", require("./routes/cartRoutes"));
  app.use("/variations", require("./routes/variationRoute"));
}

app.listen(port, () => {
  console.log(`[server] Running on port ${port} (SKIP_DB=${process.env.SKIP_DB || '0'})`);
});
require("dotenv").config();

