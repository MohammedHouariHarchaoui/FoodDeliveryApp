import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import RouterUser from "./src/api/routes/User.js";
import RouterReview from './src/api/routes/Review.js'
import RouterDeliveryMan from './src/api/routes/DeliveryMan.js'
import RouterDish from './src/api/routes/Dish.js'
import RouterOrder from './src/api/routes/Order.js'
import RouterRestaurant from './src/api/routes/Restaurant.js'
import RouterOrderItem from './src/api/routes/OrderItems.js'

const app = express();

app.use(cors());
app.use(json());
app.use(morgan("tiny"));
app.use("/users", RouterUser);
app.use("/reviews", RouterReview);
app.use("/deliveryMan", RouterDeliveryMan);
app.use("/dishes", RouterDish);
app.use("/orders", RouterOrder);
app.use("/restaurants", RouterRestaurant);
app.use("/ordersItems", RouterOrderItem);

const PORT = process.env.PORT || 5000;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
var server = app.listen(PORT, () => {
  console.log(`running on PORT : ${PORT} at : ${HOSTNAME}`);
});

export default server;