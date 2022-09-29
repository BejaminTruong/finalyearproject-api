import { ColumnService } from "*/services/column.service";
import { HttpStatusCode } from "*/utilities/constants";

const getColumns = async (req, res) => {
  try {
    const result = await ColumnService.getColumns();
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
}

const createNew = async (req, res) => {
  try {
    const result = await ColumnService.createNew(req.body);
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
    const result = await ColumnService.update(id, req.body);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ColumnService.remove(id);
    res.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message,
    });
  }
};

export const ColumnController = {
  getColumns,
  createNew,
  update,
  remove,
};
