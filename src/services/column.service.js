import { ColumnModel } from "*/models/column.model";
import { BoardModel } from "*/models/board.model";

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
    const result = await ColumnModel.update(id, updateData);
    return result;
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
