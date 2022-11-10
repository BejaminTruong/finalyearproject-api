import { UserService } from "*/services/user.service";
import { HttpStatusCode } from "*/utilities/constants";

const register = async (req, res) => {
  try {
    const result = await UserService.register(req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await UserService.login(req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const result = await UserService.getUser(req.user._id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const result = await UserService.getUserByEmail(req.params.email);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const result = await UserService.update(req.params.id, req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const result = await UserService.getAllMembers(req.params.id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

export const UserController = {
  register,
  login,
  getUser,
  update,
  getUserByEmail,
  getAllMembers,
};
