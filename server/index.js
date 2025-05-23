const express = require("express");
const app =express();
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const BookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")

app.use(cors({
    origin: 'https://rentit.vercel.app',
    credentials: true
  }));
app.use(express.json());
app.use(express.static('public'));

/* ROUTES */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", BookingRoutes)
app.use("/users", userRoutes)

app.get("/", (req, res) => {
    res.send("Backend is running.");
  });

/* MONGOOSE SETUP */
const PORT = 3001;
mongoose
    .connect(process.env.MONGO_URL, {
        dbName: "RentIt",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
        .catch((err) => console.log(`${err} did not connect`));