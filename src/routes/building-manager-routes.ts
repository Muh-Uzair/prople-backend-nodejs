import {
  buildingManagerLogout,
  buildingManagerSignUp,
  getCurrBuildingManager,
} from "@/controllers/building-manager-controller";
import express, { Router } from "express";

const router: Router = express.Router();

router.route("/signup").post(buildingManagerSignUp);
router.route("/current").get(getCurrBuildingManager);
router.route("/logout").post(buildingManagerLogout);

export default router;
