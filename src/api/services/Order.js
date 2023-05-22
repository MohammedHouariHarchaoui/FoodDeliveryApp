import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getOrders = async (req , res)=>{
    try {
        const response = await prisma.order.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const getOrderById = async (req , res)=>{
    try {
        const response = await prisma.order.findUnique({
            where:{
                id : Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const createOrder = async (req , res)=>{
    const {latitudue , longitude , deliveryNote , idDeliveryMan , status} = req.body;
    try {
        const order = await prisma.order.create({
            data:{
                latitudue : Number(latitudue),
                longitude : Number(longitude),
                deliveryNote : deliveryNote,
                idDeliveryMan : Number(idDeliveryMan),
                status : status
            }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const updateOrder = async (req , res)=>{
    const {latitudue , longitude , deliveryNote , idDeliveryMan , status} = req.body;
    try {
        const order = await prisma.order.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                latitudue : Number(latitudue),
                longitude : Number(longitude),
                deliveryNote : deliveryNote,
                idDeliveryMan : Number(idDeliveryMan),
                status : status
            }
        });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const deleteOrder = async (req , res)=>{
    try {
        const order = await prisma.order.delete({
            where:{
                id:Number(req.params.id)
            }
        });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}
