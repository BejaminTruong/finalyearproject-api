import express from "express";
import { ColumnController } from "*/controllers/column.controller";
import { ColumnValidation } from "*/validations/column.validation";

const router = express.Router();

router
  .route("/")
  .get(ColumnController.getColumns)
  .post(ColumnValidation.createNew, ColumnController.createNew);

router.route("/:id").put(ColumnValidation.update, ColumnController.update);

router.route("/:id").delete(ColumnController.remove);

export const columnRoutes = router;
