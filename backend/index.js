const connectTOMongo = require("./db");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

connectTOMongo();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors(
  {
    origin: ["https://zinstore.vercel.app"],
    methods: ["POST", "GET","PUT","DELETE"],
    credentials: true 
  }
))
app.use("/admin", require("./routes/productRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/", require("./routes/searchRoute"));
app.use("/user", require("./routes/userRoutes"));
app.use("/cart", require("./routes/cartRoutes"));
app.use("/variations", require("./routes/variationRoute"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
