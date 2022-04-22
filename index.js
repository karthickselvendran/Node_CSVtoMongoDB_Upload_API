const express = require('express');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();
const cors = require('cors');
const routes = require('./routes/routes')

// middleware
app.use(express.json());
app.use(cors());

// Server creation
app.listen((process.env.PORT), (err) => {
    if (!err) {
        console.log(`Server is running on port ${process.env.PORT}`)
    } else {
        console.log(err)
    }
})

// Database connection
mongoose.connect((process.env.MONGODB_URL), (err) => {
    if (!err) {
        console.log('MongoDB Connected')
    } else {
        console.log(err)
    }
})

// Routing
app.use('/api/v1', routes);

// test api
app.use('/', (req, res) => {
    res.json({ status: "running" })
})
