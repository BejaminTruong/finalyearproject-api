import { ColumnModel } from "*/models/column.model";
import { BoardModel } from "*/models/board.model";
import { CardModel } from "*/models/card.model";

const getColumns = async () => {
  try {
    const result = await ColumnModel.getColumns();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const newColumn = await ColumnModel.createNew(data);
    newColumn.cards = [];

    await BoardModel.pushColumnOrder(
      newColumn.boardId.toString(),
      newColumn._id.toString()
    );
    return newColumn;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };

    if (updateData._id) delete updateData._id;
    if (updateData.cards) delete updateData.cards;

    const updatedColumn = await ColumnModel.update(id, updateData);

    if (updatedColumn._destroy) {
      CardModel.deleteMany(updatedColumn.cardOrder);
    }

    return updatedColumn;
  } catch (error) {
    throw new Error(error);
  }
};

const remove = async (id) => {
  try {
    const result = await ColumnModel.remove(id);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const ColumnService = {
  getColumns,
  createNew,
  update,
  remove,
};
