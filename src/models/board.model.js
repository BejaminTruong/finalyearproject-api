import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";
import { ColumnModel } from "./column.model";
import { CardModel } from "./card.model";

const boardCollectionName = "boards";

const boardCollectionSchema = Joi.object({
  title: Joi.string().required().min(3).max(20).trim(),
  columnOrder: Joi.array().items(Joi.string()).default([]),
  members: Joi.array()
    .items({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      role: Joi.string().default("member"),
    })
    .required(),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await boardCollectionSchema.validateAsync(data, { abortEarly: false });
};

const getAllBoards = async (userId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .find({
        "members._id": userId.toString(),
        _destroy: false,
      })
      .project({ _destroy: 0 })
      .toArray();
    return result || [];
  } catch (error) {
    throw new Error(error);
  }
};

const getFullBoard = async (boardId, userId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .aggregate([
        { $match: { _id: ObjectId(boardId),"members._id": userId.toString(), _destroy: false } },
        {
          $lookup: {
            from: ColumnModel.columnCollectionName,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
            pipeline: [
              { $match: { _destroy: false } },
              { $project: { _destroy: 0 } },
            ],
          },
        },
        {
          $lookup: {
            from: CardModel.cardCollectionName,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
            pipeline: [
              { $match: { _destroy: false } },
              { $project: { _destroy: 0 } },
            ],
          },
        },
        { $project: { _destroy: 0 } },
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

    const newBoard = await BoardsModel.find({
      _id: result.insertedId,
    }).toArray();

    return newBoard[0];
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(id), _destroy: false },
        { $set: updateData },
        { returnDocument: "after" }
      );
    return result.value;
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
    await dbInstance
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(boardId), _destroy: false },
        { $push: { columnOrder: columnId } },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const removeColumnFromBoard = async (boardId, columnId) => {
  try {
    let dbInstance = await getDB();
    await dbInstance
      .collection(boardCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(boardId), _destroy: false },
        { $pull: { columnOrder: columnId.toString() } },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardModel = {
  getAllBoards,
  getFullBoard,
  pushColumnOrder,
  createNew,
  update,
  removeColumnFromBoard,
};
