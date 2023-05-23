import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: 'dt4pzi35x',
  api_key: '349196438397243',
  api_secret: '_Rto_VZa54y1kfR1_dJSn4wpS2Q',
});

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
    
    const form = formidable({
        multiples: false,
        keepExtensions: true,
        fields: ["idRestaurant" , "price" , "category" , "description"],
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
            res.status(500).send('An error occurred while uploading the dish image.');
            return;
        }
        try {
            console.log(files);
            const result = await cloudinary.v2.uploader.upload(files.image.filepath, {
                resource_type: 'image',
                folder: 'dishes_images',
            });
            console.log(result);

            const {idRestaurant , price , category , description} = fields;
            console.log(fields);
            const dish = await prisma.dish.create({
                data:{
                    idRestaurant : Number(idRestaurant), 
                    price : Number(price), 
                    category  : category,
                    description : description,
                    image : result.secure_url
                }
                
            });
                    res.status(201).json(dish);
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while uploading the dish image.');
        }
    });
}

export const updateDish = async (req , res)=>{
    const {idRestaurant , price , category , description} = req.body;
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
