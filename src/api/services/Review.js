import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getReviews = async (req, res) => {
    try {
        const response = await prisma.review.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.msg });
    }
}

export const getReviewById = async (req, res) => {
    try {
        const response = await prisma.review.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.msg });
    }
}



export const userReview = async (req, res) => {
    const { idRestaurant, idUser} = req.body;
    try {
      const response = await prisma.review.findFirst({
        where: {
          idUser: Number(idUser),
          idRestaurant: Number(idRestaurant)
        }
      });
  
      if (response) {
        const review = await prisma.review.findUnique({
            where: {
                id: Number(response.id)
            }
        });
        return res.status(201).json({"comment":review.comment , "rating":review.rating});
      } else {
        
        return res.status(201).json({"comment":"" , "rating":0});
      }
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  };
  






export const review = async (req, res) => {
  const { idRestaurant, idUser, rating, comment } = req.body;
  try {
    const response = await prisma.review.findFirst({
      where: {
        idUser: Number(idUser),
        idRestaurant: Number(idRestaurant)
      }
    });

    if (response) {
      const reviewUpdate = await prisma.review.update({
        where: {
          id: Number(response.id)
        },
        data: {
          rating: Number(rating),
          comment: comment
        }
      });

    const restaurant = await prisma.restaurant.findUnique({
        where: {
            id: Number(idRestaurant)
        }
    });

    var reviewsNum = restaurant.numberOfReviews;
    var ratingUpdate = (restaurant.numberOfReviews*restaurant.averageRating -response.rating +rating)/restaurant.numberOfReviews

      const restaurantUpdated = await prisma.restaurant.update({
        where: {
            id: Number(idRestaurant)
        },
        data: {
            numberOfReviews : Number(reviewsNum),
            averageRating : Number(ratingUpdate)
        }
    });



      return res.status(201).json(reviewUpdate);
    } else {
      const reviewCreate = await prisma.review.create({
        data: {
          idRestaurant: Number(idRestaurant),
          idUser: Number(idUser),
          rating: Number(rating),
          comment: comment
        }
      });


      const restaurant = await prisma.restaurant.findUnique({
        where: {
            id: Number(idRestaurant)
        }
    });

    var reviewsNum = restaurant.numberOfReviews + 1;
    var ratingUpdate = (restaurant.numberOfReviews*restaurant.averageRating +rating)/reviewsNum

      const restaurantUpdated = await prisma.restaurant.update({
        where: {
            id: Number(idRestaurant)
        },
        data: {
            numberOfReviews : Number(reviewsNum),
            averageRating : Number(ratingUpdate)
        }
    });




      return res.status(201).json(reviewCreate);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};




export const createReview = async (req, res) => {
    const { idRestaurant, idUser, rating, comment } = req.body;
    try {
        const review = await prisma.review.create({
            data: {
                idRestaurant: Number(idRestaurant),
                idUser: Number(idUser),
                rating: Number(rating),
                comment: comment
            }
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}

export const updateReview = async (req, res) => {
    const { idRestaurant, idUser, rating, comment } = req.body;
    try {
        const review = await prisma.review.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                idRestaurant: Number(idRestaurant),
                idUser: Number(idUser),
                rating: Number(rating),
                comment: comment
            }
        });
        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}

export const deleteReview = async (req, res) => {
    try {
        const review = await prisma.review.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        if (review) {
            res.status(200).json(review);
        } else {
            res.status(404).json({ msg: "Review not found" });
        }
    } catch (error) {
        res.status(400).json({ msg: error.msg });
    }
}
