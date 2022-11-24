import { sign, verify } from "jsonwebtoken";
import { HttpStatusCode } from "*/utilities/constants";
import { getDB } from "*/config/mongodb";
import { ObjectID } from "bson";
//For dev: require("dotenv").config();
const generateToken = (id, email) => {
  const token = sign({ id, email }, process.env.JWT_SECRET, {
    // expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });
  return token.toString();
};

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers["authorization"])
      return res.status(HttpStatusCode.UNAUTHORIZED).json({
        errors: "Authorization token not found!",
      });

    const header = req.headers["authorization"];
    const token = header.split(" ")[1];

    verify(token, process.env.JWT_SECRET, async (err, verifiedToken) => {
      if (err)
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          errors: "Authorization token invalid!",
          details: err.message,
        });
      
        let dbInstance = await getDB();
      let UserModel = await dbInstance.collection("users");
      const foundedUser = await UserModel.find({
        _id: ObjectID(verifiedToken.id),
      }).toArray();

      req.user = foundedUser[0];
      next();
    });
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: "Internal server error occured!",
      details: error.message,
    });
  }
};

export const Middleware = {
  generateToken,
  verifyToken,
};
