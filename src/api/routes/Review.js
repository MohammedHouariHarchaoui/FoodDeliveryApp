import  express  from "express";
import {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    review,
    userReview
} from '../services/Review.js'
const router = express.Router();

router.get('/',getReviews);
router.get('/:id',getReviewById);
router.post('/review',review);
router.post('/userReview',userReview);
router.post('/add',createReview);
router.patch('/edit/:id',updateReview);
router.delete('/delete/:id',deleteReview);

export default router;