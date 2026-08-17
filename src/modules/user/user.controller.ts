import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  //   console.log(req.body);

  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Created",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  console.log(req.user);
  try {
    const result = await userService.getAllUsersFromDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User retrieves successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  // console.log(id);
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    // console.log(result.rows[0]);
    res.status(200).json({
      success: true,
      message: "User retrieves successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserIntoDB(id as string, req.body);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
