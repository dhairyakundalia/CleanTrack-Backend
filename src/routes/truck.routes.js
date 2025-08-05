import {Router} from "express"
import {insertLocation} from "../models/truck.model.js"
const router = Router();

router.route("/update-location").put(insertLocation);

export default router;