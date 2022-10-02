import { BoardModel } from "*/models/board.model";

const getFullBoard = async (boardId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId);

    if (!board || !board.columns) {
      throw new Error("Board not found!");
    }

    board.columns.forEach((column) => {
      column.cards = board.cards.filter(
        (c) => c.columnId.toString() === column._id.toString()
      );
    });
    delete board.cards;

    return board;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const result = await BoardModel.createNew(data);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };

    if (updateData._id) delete updateData._id;
    if (updateData.columns) delete updateData.columns;

    const updatedBoard = await BoardModel.update(id, updateData);

    return updatedBoard;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardService = {
  getFullBoard,
  createNew,
  update,
};
