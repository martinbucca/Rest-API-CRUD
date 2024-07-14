//import express from 'express';
const express = require('express');
//import { config } from 'dotenv';
const { config } = require('dotenv');
//import mongoose from 'mongoose';
const mongoose = require('mongoose');
//import bodyParser from 'body-parser';
const bodyParser = require('body-parser');
//import bookRoutes from './routes/book.routes.js';
const bookRoutes = require('./routes/book.routes');
config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

app.use('/books', bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});