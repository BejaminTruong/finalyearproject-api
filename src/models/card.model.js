import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";

const cardCollectionName = "cards";

const cardCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  columnId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20).trim(),
  cover: Joi.string().default(null),
  description: Joi.string().default(""),
  comments: Joi.array()
    .items({
      userId: Joi.string().required(),
      username: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().default(Date.now()),
    })
    .default([]),
  members: Joi.array()
    .items({
      _id: Joi.string().required(),
      name: Joi.string().required(),
    })
    .default([]),
  checklist: Joi.array()
    .items({
      title: Joi.string().required(),
      items: Joi.array().items({
        text: Joi.string().required(),
        completed: Joi.boolean(),
      }),
    })
    .default([]),
  date: Joi.object({
    startDate: Joi.date(),
    dueDate: Joi.date(),
    dueTime: Joi.string(),
    reminder: Joi.boolean(),
    completed: Joi.boolean().default(false),
  }).default(null),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await cardCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const getAllCardsFromColumnOfOneBoard = async (boardId, columnId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
      .find({
        boardId,
        columnId,
        _destroy: false,
      })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
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
    })
      .project({ _destroy: 0 })
      .toArray();

    return searchedResult[0];
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };
    if (data.boardId) updateData.boardId = ObjectId(data.boardId);
    if (data.columnId) updateData.columnId = ObjectId(data.columnId);

    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
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

const removeMemberFromAllCards = async (removedMemberId, boardId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
      .updateMany(
        { boardId },
        { $pull: { members: { _id: removedMemberId } } }
      );
    return result;
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

const deleteAllCardInBoard = async (boardId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(cardCollectionName)
      .updateMany({ boardId: ObjectId(boardId) }, { $set: { _destroy: true } });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const CardModel = {
  cardCollectionName,
  createNew,
  update,
  removeMemberFromAllCards,
  deleteMany,
  getAllCardsFromColumnOfOneBoard,
  deleteAllCardInBoard,
};
