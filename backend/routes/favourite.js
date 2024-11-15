const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to favourites
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFavourite = userData.favourites.includes(bookid);
        
        if (isBookFavourite) {
            return res.status(200).json({ message: "Book is already in favourites" });
        }

        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
        return res.status(200).json({ message: "Book added to favourites" });
    } catch (error) {
        console.error("Error adding book to favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});




// Remove book from favourites
router.put("/remove-book-from-favourites", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        const isBookFavourite = userData.favourites.includes(bookid);

        if (isBookFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
            return res.status(200).json({ message: "Book removed from favourites" });
        } else {
            return res.status(400).json({ message: "Book not found in favourites" });
        }
    } catch (error) {
        console.error("Error removing book from favourites:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


 
//get favourite book of a particular User
router.get('/get-favourite-books', authenticateToken, async (req, res) => {  
  try {  
    const { id } = req.headers;  
    const userData = await User.findById(id).populate('favourites');  
    const favouriteBooks = userData.favourites;  
    return res.json({ status: 'Success', data: favouriteBooks });  
  } catch (error) {  
    console.log(error);  
    return res.status(500).json({ message: 'An error occurred' });  
  }  
});  




module.exports = router;



