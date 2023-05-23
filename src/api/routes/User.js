import { Router } from "express";
import { config } from "dotenv";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getPassword, getUserByEmail ,createUser, getUser } from "../services/UserModels.js";
import jwt from "jsonwebtoken";
import isUserMidd from "../middlewares/Authentification.js";
import bcrypt from "bcrypt";
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../services/UserModels.js'


if (process.env.NODE_ENV !== "production") {
    config();
}
  
const router = Router();
  


router.get('/',getUsers);
router.get('/:id',getUserById);
router.patch('/edit/:id',updateUser);
router.delete('/delete/:id',deleteUser);


  
router.post(
    "/auth/signup",
    async (req , res)=>{
    
    const form = formidable({
        multiples: false,
        keepExtensions: true,
        fields: ["firstname" , "lastname" , "phoneNumber" ,
         "latitude" , 'longitude' , 'address' , 'mdp' , 'mail' , 'status'],

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
            res.status(500).send('An error occurred while uploading the user image.');
            return;
        }
        try {
            console.log(files);
            const result = await cloudinary.v2.uploader.upload(files.image.filepath, {
                resource_type: 'image',
                folder: 'users_images',
            });
            console.log(result);

            const {firstname , lastname , phoneNumber ,
            latitude , longitude , address , mdp , mail , status} = fields;
            console.log(fields);

            const hashedPassword = await bcrypt.hash(mdp, 10);

            const user = await prisma.user.create({
                data:{
                    firstname : firstname,
                    lastname : lastname,
                    phoneNumber : phoneNumber,
                    latitude : Number(latitude),
                    longitude : Number(longitude),
                    address : address,
                    password : hashedPassword,
                    profilPictureUrl :result.secure_url,
                    email : mail,
                    status : Number(status)
                }
                
            });
                    res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(500).send('An error occurred while uploading the dish image.');
        }
    });
})




  router.post(
    "/auth/login",
    validateRequestBody(
      z.object({
        mail: z.string().email(),
        mdp: z.string(),
      })
    ),
    async (req, res) => {
      try {
        const { mail , mdp } = req.body;
        console.log(mail)
        console.log(mdp)
        const result = await getPassword(mail);
  
        
        if (result.length === 0) {
          return res.status(401).json({ status: 401, message: "Unauthorized1" });
        }
        const user = result[0];
  
        console.log(user)
  
        const password = req.body.mdp;
  
        console.log(password)
  
        if (user.idRole == 3) {
          if (password !== user.mdp) {
            return res
              .status(401)
              .json({ status: 401, message: "Unauthorized4" });
          }
        } else {
          const isPasswordCorrect = bcrypt.compareSync(password, user.mdp);
          if (!isPasswordCorrect) {
            return res
              .status(401)
              .json({ status: 401, message: "Unauthorized2" });
          }
        }
        const token = jwt.sign(
          {
            id: user.id,
            email: user.mail,
          },
          process.env.JWT_PASSPHRASE ? process.env.JWT_PASSPHRASE : "KbPassword",
          {
            expiresIn: "1d",
          }
        );
  
        res.cookie("token", token, {
          httpOnly: false,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
        if (!user.idRole == 1) {
          const newUser = await getUser(user.id);
          res.status(200).json({ status: 200, message: "OK", data: newUser[0] });
        } else {
          var userPv = user;
          delete userPv.mdp;
          req.user = userPv;
          res.status(200).json({ status: 200, message: "OK", data: userPv });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ status: 500, message: "Internal Server Error" });
      }
    }
  );
  
  router.get("/auth/isAuthenticated", isUserMidd, async (req, res) => {
    res.status(200).json({ status: 200, message: "OK", data: req.user });
  });
  
  router.get("/auth/logout", (_req, res) => {
    try {
      console.log("logout");
      res.clearCookie("token");
      res.status(200).json({ status: 200, message: "OK" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  });







  
  export default router;
  