import  express  from "express";
import {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
} from '../services/Restaurant.js'
const router = express.Router();

router.get('/',getRestaurants);
router.get('/:id',getRestaurantById);
router.post('/add',createRestaurant);
router.patch('/edit/:id',updateRestaurant);
router.delete('/delete/:id',deleteRestaurant);

export default router;