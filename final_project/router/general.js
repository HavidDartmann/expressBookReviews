const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if (isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfuly registered! Login now."});
        } else{
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn])
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const matchingBooks = [];
    for (const key in books) {
        if (books[key].author === req.params.author) {
            matchingBooks.push(books[key]);
        }
    }
    res.send(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const matchingBooks = [];
    for (const key in books) {
        if (books[key].title === req.params.title) {
            matchingBooks.push(books[key]);
        }
    }
    res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.send(books[req.params.isbn].reviews)
});

module.exports.general = public_users;
