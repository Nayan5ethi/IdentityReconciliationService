import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Service is healthy");
});

router.get("/health", (_req, res) => {
  res.status(200).send("Service is healthy");
});

export const healthCheckRouter = router;
