import express from "express";
import { UserController } from "*/controllers/user.controller";
import { UserValidation } from "*/validations/user.validation";

const router = express.Router();

router.route("/getUser").get(UserController.getUser);

router.route("/getUserByEmail/:email").get(UserController.getUserByEmail);

router
  .route("/register")
  .post(UserValidation.register, UserController.register);

router.route("/login").post(UserValidation.login, UserController.login);

router.route("/update/:id").put(UserValidation.update, UserController.update);

router.route("/getAllMembers/:id").get(UserController.getAllMembers);

export const userRoutes = router;
