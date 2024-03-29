const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let usersWithUsername = users.filter((user) =>{
        return user.username === username
    });
    if (usersWithUsername.length > 0) {
        return false
    } else {
        return true
    }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,username
        }
        console.log(accessToken);
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const session = req.session;
    const username = session.username;
    const isbn = req.params.isbn;
    const reviewText = req.query.review;

    if (!username) {
        return res.status(401).json({ message: "User is not logged in" });
    }

    if (!reviewText) {
        return res.status(400).json({ message: "Review text is missing" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    if (book.reviews.hasOwnProperty(username)) {
        // If the user has already reviewed the book, modify the existing review
        book.reviews[username] = reviewText;
        session.save(); // Save the updated session
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // If the user has not reviewed the book before, add a new review
        book.reviews[username] = reviewText;
        session.save(); // Save the updated session
        return res.status(201).json({ message: "Review added successfully" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
