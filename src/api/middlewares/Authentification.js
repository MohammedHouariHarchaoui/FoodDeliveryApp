import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { getPassword, getUser } from "../services/UserModels.js";


async function isUserMidd(req, res, next) {
  try {
    const token = req.cookies.token;

    console.log(token)

    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized1" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_PASSPHRASE ? process.env.JWT_PASSPHRASE : "KbPassword"
    );
    const result = await getPassword(decoded.email);

    if (result.length === 0) {
      return res.status(401).json({ status: 401, message: "Unauthorized2" });
    }
    const user = result[0];
    if (user.isActive === 0) {
      return res.status(401).json({ status: 401, message: "user not active" });
    }
    if (user.idRole === 3) {
      return res.status(401).json({ status: 401, message: "user deleted" });
    }

    if (!(user.idRole == 1)) {
      const newUser = await getUser(user.id);
      req.user = newUser;
    } else {
      var userPv = user;
      delete userPv.mdp;
      req.user = userPv;
    }

    next();
  } catch (error) {
    res.status(401).send("not authorized 3");
  }
}

export default isUserMidd;
