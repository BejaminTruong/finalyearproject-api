import Joi from "joi";
import { getDB } from "*/config/mongodb";

const cardCollectionName = "cards";

const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  columnId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20).trim(),
  cover: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
      .insertOne(value);
    console.log(result);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = {
  createNew,
};
