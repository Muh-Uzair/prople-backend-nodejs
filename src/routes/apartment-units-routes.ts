import express, { Router } from "express";
import { getAllApartmentUnits } from "@/controllers/apartment-units-controller";

const router: Router = express.Router();

router.route("/").get(getAllApartmentUnits);

export default router;
