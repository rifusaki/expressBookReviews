const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Username or password missing"});
  }

  if (isValid(username)) {
      return res.status(404).json({message: "User already exists"});
  }

  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  })
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.status(500).json({ message: "Internal Server Error" });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) {
      resolve(JSON.stringify(book, null, 4));
    } else {
      reject({ message: "Book not found" });
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.status(404).json(error);
 });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(JSON.stringify(booksByAuthor, null, 4));
    } else {
      reject({ message: "Books not found" });
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(JSON.stringify(booksByTitle, null, 4));
    } else {
      reject({ message: "Book not found" });
    }
  })
  .then((data) => {
    res.send(data);
  })
  .catch((error) => {
    res.status(404).json(error);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
