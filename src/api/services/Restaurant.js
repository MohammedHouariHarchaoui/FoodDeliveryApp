import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getRestaurants = async (req, res) => {
    try {
        const response = await prisma.restaurant.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.msg });
    }
}

export const getRestaurantById = async (req, res) => {
    try {
        const response = await prisma.restaurant.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Restaurant not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.msg });
    }
}

export const createRestaurant = async (req, res) => {
    const { name, description, logoPictureUrl, latitude, longitude, address, cuisineType, phoneNumber, openingTime, closingTime, email, instagram, facebook, averageRating, numberOfReviews, deliveryFees } = req.body;
    try {
        const restaurant = await prisma.restaurant.create({
            data: {
                name: name,
                description: description,
                logoPictureUrl: logoPictureUrl,
                latitude: Number(latitude),
                longitude: Number(longitude),
                address: address,
                cuisineType: cuisineType,
                phoneNumber: phoneNumber,
                openingTime: openingTime,
                closingTime: closingTime,
                email: email,
                instagram: instagram,
                facebook: facebook,
                averageRating: Number(averageRating),
                numberOfReviews: Number(numberOfReviews),
                deliveryFees: Number(deliveryFees)
            }
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}

export const updateRestaurant = async (req, res) => {
    const { name, description, logoPictureUrl, latitude, longitude, address, cuisineType, phoneNumber, openingTime, closingTime, email, instagram, facebook, averageRating, numberOfReviews, deliveryFees } = req.body;
    try {
        const restaurant = await prisma.restaurant.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: name,
                description: description,
                logoPictureUrl: logoPictureUrl,
                latitude: Number(latitude),
                longitude: Number(longitude),
                address: address,
                cuisineType: cuisineType,
                phoneNumber: phoneNumber,
                openingTime: openingTime,
                closingTime: closingTime,
                email: email,
                instagram: instagram,
                facebook: facebook,
                averageRating: Number(averageRating),
                numberOfReviews: Number(numberOfReviews),
                deliveryFees: Number(deliveryFees)
            }
        });
        if (restaurant) {
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ msg: "Restaurant not found" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}

export const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await prisma.restaurant.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        if (restaurant) {
            res.status(200).json(restaurant);
        } else {
            res.status(404).json({ msg: "Restaurant not found" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}