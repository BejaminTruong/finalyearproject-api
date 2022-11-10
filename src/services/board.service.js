import { BoardModel } from "*/models/board.model";
import { UserModel } from "*/models/user.model";
import { ColumnModel } from "*/models/column.model";
import { CardModel } from "*/models/card.model";
import { ObjectID } from "bson";
import _ from "lodash";

const getAllBoards = async (userId) => {
  try {
    const result = await BoardModel.getAllBoards(userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getFullBoard = async (boardId, userId) => {
  try {
    const board = await BoardModel.getFullBoard(boardId, userId);

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

const createNew = async (user, data) => {
  try {
    const newBoardData = {
      ...data,
      members: [
        {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "owner",
        },
      ],
    };
    const result = await BoardModel.createNew(newBoardData);
    await UserModel.pushBoardToUser(user._id, result._id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data, userId) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };
    if (updateData._id) delete updateData._id;
    if (updateData.columns) delete updateData.columns;
    if (updateData.pending || !updateData.pending) delete updateData.pending;

    if (updateData._destroy) {
      //REMOVE BOARD API:
      //1. remove board from user => UserModel.removeBoardFromUsers(userIds, boardId) - DONE
      await UserModel.removeBoardFromUsers(updateData.members, id);
      //2. delete all columns in board => ColumnModel.deleteMany(ids) - DONE
      await ColumnModel.deleteMany(updateData.columnOrder);
      //3. delete all cards in columns => CardModel.deleteMany(ids) - DONE
      await CardModel.deleteAllCardInBoard(id);
      //4. delete board => _destroy = true && columnOrder = [] && members = []; - DONE
      updateData.members = [];
      updateData.columnOrder = [];
      const deletedBoard = await BoardModel.update(id, updateData);
      return { message: `${deletedBoard.title} deleted!` };
    }

    await BoardModel.update(id, updateData);

    const result = await getFullBoard(id, userId);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateMember = async (memberId, object, userId) => {
  try {
    const updateData = { ...object.boardData, updatedAt: Date.now() };
    const cloneUpdateData = _.cloneDeep(updateData);

    if (updateData._id) delete updateData._id;
    if (updateData.columns) delete updateData.columns;
    if (updateData.pending || !updateData.pending) delete updateData.pending;

    const updatedBoard = await BoardModel.update(
      cloneUpdateData._id,
      updateData
    );

    if (object.condition)
      await UserModel.pushBoardToUser(ObjectID(memberId), updatedBoard._id);
    else {
      await UserModel.removeBoardFromUser(ObjectID(memberId), updatedBoard._id);
      await CardModel.removeMemberFromAllCards(
        memberId,
        ObjectID(updatedBoard._id)
      );
    }

    const result = await getFullBoard(updatedBoard._id, userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const BoardService = {
  getAllBoards,
  getFullBoard,
  createNew,
  update,
  updateMember,
};
