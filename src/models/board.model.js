import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";
import { ColumnModel } from "./column.model";
import { CardModel } from "./card.model";

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

const getFullBoard = async (boardId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .aggregate([
        { $match: { _id: ObjectId(boardId) } },
        {
          $lookup: {
            from: ColumnModel.columnCollectionName,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
            pipeline: [{ $match: { _destroy: false } }],
          },
        },
        {
          $lookup: {
            from: CardModel.cardCollectionName,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
            pipeline: [{ $match: { _destroy: false } }],
          },
        },
      ])
      .toArray();
    return result[0] || {};
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const value = await validateSchema(data);

    let dbInstance = await getDB();
    let BoardsModel = dbInstance.collection(boardCollectionName);

    const result = await BoardsModel.insertOne(value);

    const searchedResult = await BoardsModel.find({
      _id: result.insertedId,
    }).toArray();

    return searchedResult[0];
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * @param {string} boardId
 * @param {string} columnId
 */
const pushColumnOrder = async (boardId, columnId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(boardId) },
        { $push: { columnOrder: columnId } },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardModel = {
  getFullBoard,
  pushColumnOrder,
  createNew,
};
