import Joi from "joi";
import { HttpStatusCode } from "*/utilities/constants";

const register = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
    repeated_password: Joi.string().required(),
  });
  try {
    if (req.password !== req.repeated_password)
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        errors: "Password doesn't match Repeate_Password!",
      });
    await condition.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

const login = async (req, res, next) => {
  const condition = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
  });
  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

const update = async (req, res, next) => {
  const condition = Joi.object({
    name: Joi.string().required(),
    password: Joi.string(),
  });
  try {
    await condition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

export const UserValidation = {
  register,
  login,
  update,
};
