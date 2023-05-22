import { Router } from "express";
import { config } from "dotenv";
import { validateRequestBody } from "zod-express-middleware";
import { z } from "zod";
import { getPassword, getUserByEmail ,createUser, getUser } from "../services/UserModels.js";
import jwt from "jsonwebtoken";
import isUserMidd from "../middlewares/Authentification.js";
import bcrypt from "bcrypt";

if (process.env.NODE_ENV !== "production") {
    config();
  }
  
  const router = Router();
  
  

router.post(
    "/auth/signup",
    validateRequestBody(
      z.object({
        mail: z.string().email(),
        mdp: z.string().min(6),
        // Add other required fields for signup
      })
    ),
    async (req, res) => {
      try {
        const { mail, mdp , firstname , lastname , phoneNumber , latitude , longitude , address , profilPictureUrl , status } = req.body;
  
        // Check if user already exists with the given email
        const existingUser = await getUserByEmail(mail);
        if (existingUser) {
          return res.status(400).json({ status: 400, message: "Email already exists" });
        }
  
  
        console.log(req.body)
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(mdp, 10);
  
        // Create user in the database
        const newUser = await createUser({
            firstname : firstname,
            lastname : lastname,
            phoneNumber : phoneNumber,
            latitude : Number(latitude),
            longitude : Number(longitude),
            address  : address,
            password : hashedPassword,
            profilPictureUrl : profilPictureUrl,
            email : mail,
            status : status
          // Add other fields for signup
        });
  
        res.status(201).json({ status: 201, message: "User created successfully", data: newUser });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
      }
    }
  );
  




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
  