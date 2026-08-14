import { Router, type NextFunction } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "./user.interface";

const router = Router();

router.post("/", userController.createUser);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.AGENT),
  userController.getAllUsers,
);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
