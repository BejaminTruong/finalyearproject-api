import Joi from "joi";
import { getDB } from "*/config/mongodb";

const columnCollectionName = "columns";

const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20),
  cardOrder: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await columnCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .insertOne(value);
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const ColumnModel = {
  createNew,
};
