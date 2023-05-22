import  express  from "express";
import {
    getOrdersItems,
    getOrderItemById,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
    getOrdersItems
} from '../services/OrderItems.js'
const router = express.Router();

router.get('/',getOrdersItems);
router.get('/:id',getOrderItemById);
router.post('/add',createOrderItem);
router.patch('/edit/:id',updateOrderItem);
router.delete('/delete/:id',deleteOrderItem);

export default router;