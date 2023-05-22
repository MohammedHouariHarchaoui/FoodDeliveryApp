import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getDishes = async (req , res)=>{
    try {
        const response = await prisma.dish.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const getDishById = async (req , res)=>{
    try {
        const response = await prisma.dish.findUnique({
            where:{
                id : Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Dish not found" });
        }
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const createDish = async (req , res)=>{
    const {idRestaurant , price , category , description , image} = req.body;
    try {
        const dish = await prisma.dish.create({
            data:{
                idRestaurant : Number(idRestaurant), 
                price : Number(price), 
                category  : category,
                description : description,
                image : image 
            }
        });
        res.status(201).json(dish);
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const updateDish = async (req , res)=>{
    const {idRestaurant , price , category , description , image} = req.body;
    try {
        const dish = await prisma.dish.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                idRestaurant : Number(idRestaurant), 
                price : Number(price), 
                category  : category,
                description : description,
                image : image
            }
        });
        if (dish) {
            res.status(200).json(dish);
        } else {
            res.status(404).json({ msg: "Dish not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const deleteDish = async (req , res)=>{
    try {
        const dish = await prisma.dish.delete({
            where:{
                id:Number(req.params.id)
            }
        });
        if (dish) {
            res.status(200).json(dish);
        } else {
            res.status(404).json({ msg: "Dish not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}
