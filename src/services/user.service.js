import { UserModel } from "*/models/user.model";
import { compare, hash } from "bcryptjs";
import { Middleware } from "*/middlewares";
const register = async (data) => {
  try {
    const hashedPassword = await hash(data.password, 8);
    data.password = hashedPassword;
    data.repeated_password = hashedPassword;
    const newUser = await UserModel.register(data);
    if (!newUser) throw new Error("Email already existed!").message;
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (data) => {
  try {
    const result = await UserModel.login(data);
    if (!result) throw new Error("Email not found!").message;
    const hashedPassword = result.password;
    const comparedPassword = await compare(data.password, hashedPassword);
    if (!comparedPassword) throw new Error("Wrong password!").message;
    result.token = Middleware.generateToken(
      result._id.toString(),
      result.email
    );
    result.password = undefined;
    result.repeated_password = undefined;
    result._destroy = undefined;
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (userId) => {
  try {
    const result = await UserModel.getUser(userId);
    if (!result) throw new Error("User not found!").message;
    result.password = undefined;
    result.repeated_password = undefined;
    result._destroy = undefined;
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserByEmail = async (userEmail) => {
  try {
    const result = await UserModel.getUserByEmail(userEmail);
    if (!result) throw new Error("User not found!").message;
    result.password = undefined;
    result.repeated_password = undefined;
    result._destroy = undefined;
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, userData) => {
  try {
    let updatedUser;
    delete userData.email;
    if (userData.password) {
      const hashedPassword = await hash(userData.password, 8);
      updatedUser = {
        ...userData,
        password: hashedPassword,
        repeated_password: hashedPassword,
        updatedAt: Date.now(),
      };
    } else updatedUser = { ...userData, updatedAt: Date.now() };
    const result = await UserModel.update(userId, updatedUser);
    if (!result) throw new Error("User not found!").message;
    result.password = undefined;
    result.repeated_password = undefined;
    result._destroy = undefined;
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllMembers = async (boardId) => {
  try {
    const result = await UserModel.getAllMembers(boardId)
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const UserService = {
  register,
  login,
  getUser,
  update,
  getUserByEmail,
  getAllMembers,
};
