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

const getOneColumn = async (columnId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .find({ _id: ObjectId(columnId), _destroy: false })
      .project({ _destroy: 0 })
      .toArray();
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

const getColumns = async () => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .find({ _destroy: false })
      .project({ _destroy: 0 })
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
    };

    let dbInstance = await getDB();
    let ColumnsModel = dbInstance.collection(columnCollectionName);

    const result = await ColumnsModel.insertOne(insertValue);
    const searchedResult = await ColumnsModel.find({
      _id: result.insertedId,
    })
      .project({ _destroy: 0 })
      .toArray();

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
        { _id: ObjectId(columnId), _destroy: false },
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
        { _id: ObjectId(id), _destroy: false },
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
        { _id: ObjectId(id), _destroy: false },
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

const deleteMany = async (ids) => {
  try {
    const transformIds = ids.map((i) => ObjectId(i));
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(columnCollectionName)
      .updateMany({ _id: { $in: transformIds } }, { $set: { _destroy: true, cardOrder: [] } });
    return result;
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
  getOneColumn,
  deleteMany,
};
