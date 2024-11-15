const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

// Add book -- admin
router.post("/add-books", authenticateToken, async (req, res) => {  
    try {  
      const { id } = req.headers;  
      const user = await User.findById(id);  
  
      if (user.role !== "admin") {  
        return res.status(400).json({ message: "You do not have access to perform admin work" });  
      }  
  
      const books = req.body; // Assuming the request body contains an array of book objects  
  
      // Check if the request body is an array  
      if (!Array.isArray(books)) {  
        return res.status(400).json({ message: "Request body must be an array of books" });  
      }  
  
      // Create and save each book  
      const savedBooks = await Promise.all(  
        books.map(async (book) => {  
          const newBook = new Book({  
            url: book.url,  
            title: book.title,  
            author: book.author,  
            price: book.price,  
            desc: book.desc,  
            language: book.language,  
          });  
          return await newBook.save();  
        })  
      );  
  
      res.status(200).json({ message: "Books added successfully", books: savedBooks });  
    } catch (error) {  
      console.error("Error adding books:", error);  
      res.status(500).json({ message: "Internal server error" });  
    }  
  });




// Update book -- admin
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language,
        });
        return res.status(200).json({
            message: "Book updated successfully!",
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});




// Delete book -- admin
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
});



// Get all books
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Get recently added books (Limit 4)
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({ status: "Success", data: books });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});






// Get book by ID
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});



module.exports = router;





