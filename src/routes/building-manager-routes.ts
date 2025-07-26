import {
  buildingManagerLogin,
  buildingManagerSignout,
  buildingManagerSignUp,
  createBuildingManagerUsingGoogle,
  getBuildingManagerByEmail,
  getCurrBuildingManager,
} from "@/controllers/building-manager-controller";
import express, { RequestHandler, Router } from "express";

const router: Router = express.Router();

router.route("/signup").post(buildingManagerSignUp);
router.route("/current").get(getCurrBuildingManager);
router
  .route("/current-by-email")
  .post(getBuildingManagerByEmail as RequestHandler);
router.route("/signout").post(buildingManagerSignout);
router.route("/login").post(buildingManagerLogin);
router
  .route("/signup-google")
  .post(createBuildingManagerUsingGoogle as RequestHandler);

export default router;
