import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";

const columnCollectionName = "columns";

const columnCollectionSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().required().min(3).max(20).trim(),
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

const getColumns = async () => {
  try {
    let dbInstance = await getDB();
    const cursor = await dbInstance
      .collection(columnCollectionName)
      .find({ _destroy: false });
    const result = await cursor.toArray();
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
    };

    let dbInstance = await getDB();
    let ColumnsModel = dbInstance.collection(columnCollectionName);

    const result = await ColumnsModel.insertOne(insertValue);
    const searchedResult = await ColumnsModel.find({
      _id: result.insertedId,
    }).toArray();

    return searchedResult[0];
  } catch (error) {
    throw new Error(error);
  }
};
/**
 * @param {string} columnId
 * @param {string} cardId
 */
const pushCardOrder = async (columnId, cardId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(columnId) },
        { $push: { cardOrder: cardId } },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data };
    if (data.boardId) updateData.boardId = ObjectId(data.boardId);

    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          $set: {
            _destroy: true,
            updatedAt: Date.now(),
          },
        },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

export const ColumnModel = {
  columnCollectionName,
  getColumns,
  createNew,
  pushCardOrder,
  update,
  remove,
};
