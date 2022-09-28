import Joi from "joi";
import { HttpStatusCode } from "*/utilities/constants";

const createNew = async (req, res, next) => {
  const condition = Joi.object({
    title: Joi.string().required().min(3).max(20),
  });
  try {
    await condition.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message,
    });
  }
};

export const BoardValidation = { createNew };
