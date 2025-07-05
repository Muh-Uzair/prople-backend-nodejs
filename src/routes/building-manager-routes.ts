import { buildingManagerSignUp } from "@/controllers/building-manager-controller";
import express, { Router } from "express";

const router: Router = express.Router();

router.route("/signup").post(buildingManagerSignUp);

export default router;
