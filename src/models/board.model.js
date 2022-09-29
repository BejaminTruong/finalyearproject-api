import Joi from "joi";
import { getDB } from "*/config/mongodb";

const boardCollectionName = "boards";

const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .insertOne(value);
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error)
  }
};

export const BoardModel = {
  createNew,
};
