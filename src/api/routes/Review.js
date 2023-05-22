import  express  from "express";
import {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
} from '../services/Review.js'
const router = express.Router();

router.get('/',getReviews);
router.get('/:id',getReviewById);
router.post('/add',createReview);
router.patch('/edit/:id',updateReview);
router.delete('/delete/:id',deleteReview);

export default router;