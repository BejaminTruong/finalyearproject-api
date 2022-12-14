import { BoardService } from "*/services/board.service";
import { HttpStatusCode } from "*/utilities/constants";

const getAllBoards = async (req, res) => {
  try {
    const result = await BoardService.getAllBoards(req.user._id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const getFullBoard = async (req, res) => {
  try {
    const result = await BoardService.getFullBoard(req.params.id, req.user._id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const createNew = async (req, res) => {
  try {
    const result = await BoardService.createNew(req.user, req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BoardService.update(id, req.body, req.user._id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BoardService.updateMember(id, req.body, req.user._id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

export const BoardController = {
  getAllBoards,
  getFullBoard,
  createNew,
  update,
  updateMember,
};
