import express from "express";
import { BoardController } from "*/controllers/board.controller";
import { BoardValidation } from "*/validations/board.validation";

const router = express.Router();

router
  .route("/")
  .get(BoardController.getAllBoards)
  .post(BoardValidation.createNew, BoardController.createNew);

router
  .route("/:id")
  .get(BoardController.getFullBoard)
  .put(BoardValidation.update, BoardController.update);

router
  .route("/updateMember/:id")
  .post(BoardValidation.update, BoardController.updateMember);

export const boardRoutes = router;
