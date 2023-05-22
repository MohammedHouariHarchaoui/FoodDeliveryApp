import  express  from "express";
import {
    getDeliveryMen,
    getDeliveryManById,
    createDeliveryMan,
    updateDeliveryMan,
    deleteDeliveryMan
} from '../services/DeliveryMan.js'
const router = express.Router();

router.get('/',getDeliveryMen);
router.get('/:id',getDeliveryManById);
router.post('/add',createDeliveryMan);
router.patch('/edit/:id',updateDeliveryMan);
router.delete('/delete/:id',deleteDeliveryMan);

export default router;