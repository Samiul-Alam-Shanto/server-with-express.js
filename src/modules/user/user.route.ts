import { Router, type NextFunction } from "express";
import { userController } from "./user.controller";

const router = Router();

const auth = (req: Request, res: Response, next: NextFunction) => {
  console.log("This is protected route");
};

router.post("/", userController.createUser);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
