import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getOrdersItems = async (req , res)=>{
    try {
        const response = await prisma.orderItems.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const getOrderItemById = async (req , res)=>{
    try {
        const response = await prisma.orderItems.findMany({
            where:{
                id : Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Order item not found" });
        }
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const createOrderItem = async (req , res)=>{
    const {idDish , idOrder , quantity , dishNote} = req.body;
    try {
        const orderItem = await prisma.orderItems.create({
            data:{
                idDish : Number(idDish),
                idOrder : Number(idOrder),
                quantity : Number(quantity),
                dishNote : dishNote
            }
        });
        res.status(201).json(orderItem);
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const updateOrderItem = async (req , res)=>{
    const {idDish , idOrder , quantity , dishNote} = req.body;
    try {
        const orderItem = await prisma.orderItems.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                idDish : Number(idDish),
                idOrder : Number(idOrder),
                quantity : Number(quantity),
                dishNote : dishNote
            }
        });
        if (orderItem) {
            res.status(200).json(orderItem);
        } else {
            res.status(404).json({ msg: "Order item not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const deleteOrderItem = async (req , res)=>{
    try {
        const orderItem = await prisma.orderItems.delete({
            where:{
                id:Number(req.params.id)
            }
        });
        if (orderItem) {
            res.status(200).json(orderItem);
        } else {
            res.status(404).json({ msg: "Order item not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}
