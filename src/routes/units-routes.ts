import express, { Router } from "express";
import { getAllUnits } from "@/controllers/units-controller";

const router: Router = express.Router();

router.route("/").get(getAllUnits);

export default router;
