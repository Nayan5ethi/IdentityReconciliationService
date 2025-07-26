import { Router } from "express";
import contactRouter from "./contact.route";
const router = Router();

router.use("/contact", contactRouter);

export const routes = router;
