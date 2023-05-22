import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getDeliveryMen = async (req , res)=>{
    try {
        const response = await prisma.deliveryMan.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const getDeliveryManById = async (req , res)=>{
    try {
        const response = await prisma.deliveryMan.findUnique({
            where:{
                id : Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Delivery man not found" });
        }
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const createDeliveryMan = async (req , res)=>{
    const {idRestaurant , firstname , lastname , phoneNumber , profilPictureUrl , status , email , latitude , longitude} = req.body;
    try {
        const deliveryMan = await prisma.deliveryMan.create({
            data:{
                idRestaurant : Number(idRestaurant),
                firstname : firstname,
                lastname : lastname,
                phoneNumber : phoneNumber,
                profilPictureUrl : profilPictureUrl,
                status : status,
                email : email,
                latitude : Number(latitude),
                longitude : Number(longitude)
            }
        });
        res.status(201).json(deliveryMan);
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const updateDeliveryMan = async (req , res)=>{
    const {idRestaurant , firstname , lastname , phoneNumber , profilPictureUrl , status , email , latitude , longitude} = req.body;
    try {
        const deliveryMan = await prisma.deliveryMan.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                idRestaurant : Number(idRestaurant),
                firstname : firstname,
                lastname : lastname,
                phoneNumber : phoneNumber,
                profilPictureUrl : profilPictureUrl,
                status : status,
                email : email,
                latitude : Number(latitude),
                longitude : Number(longitude)
            }
        });
        if (deliveryMan) {
            res.status(200).json(deliveryMan);
        } else {
            res.status(404).json({ msg: "Delivery man not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const deleteDeliveryMan = async (req , res)=>{
    try {
        const deliveryMan = await prisma.deliveryMan.delete({
            where:{
                id:Number(req.params.id)
            }
        });
        if (deliveryMan) {
            res.status(200).json(deliveryMan);
        } else {
            res.status(404).json({ msg: "Delivery man not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}
