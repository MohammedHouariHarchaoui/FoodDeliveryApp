import  express  from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
} from '../services/Order.js'
const router = express.Router();

router.get('/',getOrders);
router.get('/:id',getOrderById);
router.post('/add',createOrder);
router.patch('/edit/:id',updateOrder);
router.delete('/delete/:id',deleteOrder);

export default router;