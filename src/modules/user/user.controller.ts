import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);
    res.status(200).json({
      success: true,
      message: "Created",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const userController = { createUser };
