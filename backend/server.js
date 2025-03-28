const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// App
const app = express();
const productRoutes = require('./routes/products');
const authRoutes = require("./routes/auth");

// Mongoose
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

// Port and IP
const port = process.env.PORT || 8000;
const ip = process.env.IP || '127.0.0.1';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Use the user routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(port, ip, () => console.log(`Server is running on http://${ip}:${port}`));