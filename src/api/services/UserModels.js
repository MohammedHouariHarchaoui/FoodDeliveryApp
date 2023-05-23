import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPassword(email) {
    try {
      const user = await prisma.user.findMany({
        where: { email: email },
      });
      console.log('Found user:', user);
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting password:', error);
      throw error;
    }
  }


export async function createUser(userData) {
    try {
      const user = await prisma.user.create({
        data: userData,
      });
      return user;
    } catch (error) {
      throw error;
    }
  }

export async function getUser(id) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    throw error;
  }
}


export async function getUserByEmail(mail) {
  try {
    const user = await prisma.user.findUnique({ where: { email : mail } });
    return user;
  } catch (error) {
    throw error;
  }
}


export const getUsers = async (req , res)=>{
  try {
      const response = await prisma.user.findMany();
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({msg : error.msg});
  }
}

export const getUserById = async (req , res)=>{
  try {
      const response = await prisma.user.findUnique({
          where:{
              id : Number(req.params.id)
          }
      });
      if (response) {
          res.status(200).json(response);
      } else {
          res.status(404).json({ msg: "User not found" });
      }
  } catch (error) {
      res.status(500).json({msg : error.msg});
  }
}

export const updateUser = async (req , res)=>{
  const {idRestaurant , price , category , description , image} = req.body;
  try {
      const user = await prisma.user.update({
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
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ msg: "User not found" });
      }
  } catch (error) {
      res.status(400).json({msg : error.msg});
  }
}

export const deleteUser = async (req , res)=>{
  try {
      const user = await prisma.user.delete({
          where:{
              id:Number(req.params.id)
          }
      });
      if (user) {
          res.status(200).json(user);
      } else {
          res.status(404).json({ msg: "User not found" });
      }
  } catch (error) {
      res.status(400).json({msg : error.msg});
  }
}
