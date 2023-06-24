import { Router } from "express";
import { config } from "dotenv";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getPassword, getUserByEmail, createUser, getUser } from "../services/UserModels.js";
import jwt from "jsonwebtoken";
import isUserMidd from "../middlewares/Authentification.js";
import bcrypt from "bcrypt";
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { PrismaClient } from "@prisma/client"
// import admin from 'firebase-admin';
// import serviceAccount from 'path/to/serviceAccountKey.json';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {  getAuth, signInWithPopup } from "firebase/auth";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../services/UserModels.js'

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
// });

// const auth = admin.auth();


const prisma = new PrismaClient();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
import {GoogleAuthProvider} from 'firebase/auth'
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Create a Google authentication provider
//const googleProvider = new firebase.auth.GoogleAuthProvider();



if (process.env.NODE_ENV !== "production") {
  config();
}

const router = Router();




// router.post('/signup-google', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         // Signed in
//         var user = userCredential.user;
//         console.log(user);
//       })
//       .catch((error) => {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log(error);
//       });
//     res.redirect('/');
//   } catch (e) {
//     res.redirect('register');
//   }
// })

// router.post('/signin-google', async (req, res) => {
//   const { email, password } = req.body;
//   firebase.auth().signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       var user = userCredential.user;
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//     });
//   res.redirect('/');
// })




router.get('/', getUsers);
router.get('/:id', getUserById);
router.patch('/edit/:id', updateUser);
router.delete('/delete/:id', deleteUser);


router.post(
  "/auth/signup",
  async (req, res) => {

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      fields: ["firstname", "lastname", "phoneNumber",
         'address', 'mdp', 'mail'],

      fileFilter: function (req, file, callback) {
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
        // console.log(files);
        const result = await cloudinary.v2.uploader.upload(files.image.filepath, {
          resource_type: 'image',
          folder: 'users_images',
        });
        // console.log(result);

        const { firstname, lastname, phoneNumber,
           address, mdp, mail } = fields;
        console.log(fields);

        const hashedPassword = await bcrypt.hash(mdp, 10);

        const user = await prisma.user.create({
          data: {
            firstname: firstname,
            lastname: lastname,
            phoneNumber: phoneNumber,
            latitude: 36.7050342,
            longitude: 3.1713407,
            address: address,
            password: hashedPassword,
            profilPictureUrl: result.secure_url,
            email: mail,
            status: 1
          }

        });
        res.status(201).send({ id: user.id });
      } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while uploading the dish image.');
      }
    });
  })




router.post(
  "/auth/login",
  
  async (req, res) => {
    try {
      const { mail, mdp } = req.body;
      const result = await getPassword(mail);
      console.log("After getting password and email")
      console.log(result)

      if (result.length === 0) {
        return res.status(401).json({ status: 401, message: "User dosn't exist" });
      }

      const user = result[0];
      console.log("After getting user")
      console.log(user)

      if(user.status == 0){
        return res.status(401).json({ status: 401, message: "UNAUTHORIZED" });
      }

      console.log(req.body)
      const password = req.body.mdp;


      console.log("password = "+password);
      console.log("email = "+req.body.mail);
      console.log("user password "+user.password)

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      
      console.log("After comparing password")
      console.log(isPasswordCorrect);
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ status: 401, message: "Incorrect password" });
        }
      
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
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
      
        var userPv = user;
        delete userPv.mdp;
        req.user = userPv;

        

        res.status(200).send({ id: userPv.id });
      
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
