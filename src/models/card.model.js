import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";

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
    const validatedValue = await validateSchema(data);
    const insertValue = {
      ...validatedValue,
      boardId: ObjectId(validatedValue.boardId),
      columnId: ObjectId(validatedValue.columnId),
    };

    let dbInstance = await getDB();
    let CardsModel = dbInstance.collection(cardCollectionName);

    const result = await CardsModel.insertOne(insertValue);

    const searchedResult = await CardsModel.find({
      _id: result.insertedId,
    }).toArray();

    return searchedResult[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map((i) => ObjectId(i));
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
      .updateMany({ _id: { $in: transformIds } }, { $set: { _destroy: true } });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = {
  cardCollectionName,
  createNew,
  deleteMany,
};
