import { CardModel } from "*/models/card.model";
import { ColumnModel } from "*/models/column.model";
import { BoardService } from  "*/services/board.service"
const createNew = async (data) => {
  try {
    const newCard = await CardModel.createNew(data);

    await ColumnModel.pushCardOrder(
      newCard.columnId.toString(),
      newCard._id.toString()
    );

    return newCard;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data, userId) => {
  try {
    const updateData = { ...data, updatedAt: Date.now() };

    if (updateData._id) delete updateData._id;

    const updatedCard = await CardModel.update(id, updateData);
    
    const updatedBoard = await BoardService.getFullBoard(updatedCard.boardId, userId);
    return updatedBoard
  } catch (error) {
    throw new Error(error);
  }
};

export const CardService = {
  createNew,
  update,
};
