import Joi from "joi";
import { getDB } from "*/config/mongodb";
import { ObjectId } from "mongodb";

const userCollectionName = "users";

const userCollectionSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
  repeated_password: Joi.string().required(),
  boards: Joi.array().items(Joi.string()).default([]),
  avatar: Joi.string().default(null),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(null),
  _destroy: Joi.boolean().default(false),
});

const validateSchema = async (data) => {
  return await userCollectionSchema.validateAsync(data, {
    abortEarly: false,
  });
};

const register = async (data) => {
  try {
    const value = await validateSchema(data);
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    const foundedUser = await UserModel.find({
      email: data.email,
      _destroy: false,
    }).toArray();
    if (foundedUser.length > 0) return null;
    const result = await UserModel.insertOne(value);
    const searchedResult = await UserModel.find({
      _id: result.insertedId,
    })
      .project({ _destroy: 0 })
      .toArray();

    return searchedResult[0];
  } catch (error) {
    throw new Error(error).message;
  }
};

const login = async (data) => {
  try {
    const { email } = data;
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    const result = await UserModel.find({ email, _destroy: false })
      .project({ _destroy: 0 })
      .toArray();
    if (result.length < 1) return null;
    return result[0];
  } catch (error) {
    throw new Error(error).message;
  }
};

const getUser = async (userId) => {
  try {
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    const result = await UserModel.find({ _id: userId, _destroy: false })
      .project({ _destroy: 0 })
      .toArray();
    if (result.length < 1) return null;
    return result[0];
  } catch (error) {
    throw new Error(error).message;
  }
};

const getUserByEmail = async (userEmail) => {
  try {
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    const result = await UserModel.find({ email: userEmail, _destroy: false })
      .project({ _destroy: 0 })
      .toArray();
    if (result.length < 1) return null;
    return result[0];
  } catch (error) {
    throw new Error(error).message;
  }
};

const update = async (userId, userData) => {
  try {
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    const result = await UserModel.findOneAndUpdate(
      { _id: ObjectId(userId), _destroy: false },
      { $set: userData },
      { returnDocument: "after" }
    );
    if (!result.value) return null;
    return result.value;
  } catch (error) {
    throw new Error(error).message;
  }
};

const pushBoardToUser = async (userId, boardId) => {
  try {
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { boards: boardId.toString() } },
      { returnDocument: "after" }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const removeBoardFromUser = async (userId, boardId) => {
  try {
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { boards: boardId.toString() } },
      { returnDocument: "after" }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const removeBoardFromUsers = async (userIds, boardId) => {
  try {
    // let transformIds = userIds.map((i) => ObjectId(i));
    let transformIds = userIds.map((i) => ObjectId(i._id));
    let dbInstance = await getDB();
    let UserModel = await dbInstance.collection(userCollectionName);
    await UserModel.updateMany(
      { _id: { $in: transformIds } },
      { $pull: { boards: boardId } },
      { returnDocument: "after" }
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMembers = async (boardId) => {
  try {
    let dbInstance = await getDB();
    const result = await dbInstance
      .collection(userCollectionName)
      .find({ boards: { $eq: boardId }, _destroy: false })
      .project({ password: 0, repeated_password: 0, _destroy: 0 })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const UserModel = {
  userCollectionName,
  register,
  login,
  getUser,
  update,
  pushBoardToUser,
  getUserByEmail,
  getAllMembers,
  removeBoardFromUser,
  removeBoardFromUsers,
};
