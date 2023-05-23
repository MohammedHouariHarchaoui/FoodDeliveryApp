import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

cloudinary.v2.config({
    cloud_name: env(cloud_name),
    api_key: env(api_key),
    api_secret: env(api_secret),
});


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
    const form = formidable({
        multiples: false,
        keepExtensions: true,
        fields: ["name", "description", "latitude", "longitude", "address", "cuisineType", "phoneNumber", "openingTime", "closingTime", "email", "instagram", "facebook", "averageRating", "numberOfReviews", "deliveryFees"],
        fileFilter: function(req, file, callback) {
            if (!file.type.startsWith('image/')) {
              return callback(new Error('Only image files are allowed!'));
            }
            callback(null, true);
        }
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while uploading the restaurant image.');
            return;
        }
        try {
            console.log(files);
            const result = await cloudinary.v2.uploader.upload(files.image.filepath, {
                resource_type: 'image',
                folder: 'restaurants_images',
            });
            console.log(result);

            const { name, description, latitude, longitude, address, cuisineType, phoneNumber, openingTime, closingTime, email, instagram, facebook, averageRating, numberOfReviews, deliveryFees } = fields;
            console.log(fields);
            const restaurant = await prisma.restaurant.create({
                data: {
                    name: name,
                    description: description,
                    logoPictureUrl: result.secure_url,
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
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while uploading the restaurant image.');
        }
    });
}

export const updateRestaurant = async (req, res) => {
    const { name, description, latitude, longitude, address, cuisineType, phoneNumber, openingTime, closingTime, email, instagram, facebook, averageRating, numberOfReviews, deliveryFees } = req.body;
    try {
        const restaurant = await prisma.restaurant.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: name,
                description: description,
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