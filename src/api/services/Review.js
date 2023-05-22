import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getReviews = async (req , res)=>{
    try {
        const response = await prisma.review.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const getReviewById = async (req , res)=>{
    try {
        const response = await prisma.review.findUnique({
            where:{
                id : Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(500).json({msg : error.msg});
    }
}

export const createReview = async (req , res)=>{
    const {idRestaurant , idUser , rating , comment} = req.body;
    try {
        const review = await prisma.review.create({
            data:{
                idRestaurant : Number(idRestaurant), 
                idUser : Number(idUser),
                rating : Number(rating),
                comment : comment
            }
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const updateReview = async (req , res)=>{
    const {idRestaurant , idUser , rating , comment} = req.body;
    try {
        const review = await prisma.review.update({
            where:{
                id:Number(req.params.id)
            },
            data:{
                idRestaurant : Number(idRestaurant), 
                idUser : Number(idUser),
                rating : Number(rating),
                comment : comment
            }
        });
        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}

export const deleteReview = async (req , res)=>{
    try {
        const review = await prisma.review.delete({
            where:{
                id:Number(req.params.id)
            }
        });
        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(400).json({msg : error.msg});
    }
}
