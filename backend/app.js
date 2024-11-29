const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");
app.use(express.json());
app.use(cors());
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");
const Payment = require("./routes/payment");
const Transaction = require("./routes/transaction");
const Review = require("./routes/reviewRoutes"); 
const Chat = require("./routes/chat"); 

app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);
app.use("/api/v1", Payment);
app.use("/api/v1", Transaction);
app.use("/api/v1", Review); 
app.use("/api/v1", Chat); 

app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
