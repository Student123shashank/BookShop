const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { authenticateToken } = require("./userAuth");

// Route to add a review
router.post('/add-review', authenticateToken, addReview);

// Route to get reviews for a specific book
router.get('/get-reviews/:bookId', getReviews);

module.exports = router;
