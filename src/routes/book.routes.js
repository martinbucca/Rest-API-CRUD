//import express from 'express';
const express = require('express');
//import Book from '../models/book.model.js'
const Book = require('../models/book.model');

const router = express.Router();

// MIDDLEWARE

const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'Invalid book ID' });
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.book = book;
    next();
};


// [GET] /books

router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL BOOKS: ', books);
        if (!books) {
            return res.status(204).json([])
        }
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [GET] /books/:id

router.get('/:id', getBook, (req, res) => {
    res.json(res.book);
});


// [POST] /books

router.post('/', async (req, res) => {
    const  { title, author, genre, publicationYear, language } = req.body;
    if (!title || !author || !genre || !publicationYear || !language) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newBook = new Book({ title, author, genre, publicationYear, language });
    try {
        const savedBook = await newBook.save();
        console.log('SAVED BOOK: ', savedBook);
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// [PUT] /books/:id

router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationYear = req.body.publicationYear || book.publicationYear;
        book.language = req.body.language || book.language;
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [PATCH] /books/:id

router.patch('/:id', getBook, async (req, res) => {
    if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publicationYear && !req.body.language) {
        return res.status(400).json({ message: 'At least one field is required' });
    }
    try {
        const book = res.book;
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publicationYear = req.body.publicationYear || book.publicationYear;
        book.language = req.body.language || book.language;
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// [DELETE] /books/:id
router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;
        await book.deleteOne({ _id: book._id });
        res.json({ message: `Book ${book.title} was removed correctly` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

