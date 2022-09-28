import express from "express";
import { HttpStatusCode } from "*/utilities/constants";
import { boardRoutes } from "./board.route";
const router = express.Router();

router.get("/status", (req, res) => {
  res.status(HttpStatusCode.OK).json({ status: "OK" });
});

router.use("/boards", boardRoutes);

export const apiV1 = router;
