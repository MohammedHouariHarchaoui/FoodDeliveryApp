import  express  from "express";
import {
    getDishes,
    getDishById,
    createDish,
    updateDish,
    deleteDish
} from '../services/Dish.js'
const router = express.Router();

router.get('/',getDishes);
router.get('/:id',getDishById);
router.post('/add',createDish);
router.patch('/edit/:id',updateDish);
router.delete('/delete/:id',deleteDish);

export default router;