import express from "express";
export const usersApiRouter = express.Router();
import { usersController } from "../controllers/users.controller.js";
import { profileUploader } from "../utils/main.js";

usersApiRouter.get("/", usersController.read); /* READ ALL USERS*/
usersApiRouter.get("/basic-info", usersController.readBasicInfo); /*READ ALL USERS BASIC INFO*/
usersApiRouter.put("/:_id", usersController.update); /*REFRESH USER ID*/
usersApiRouter.delete("/deleteInactiveUsers", usersController.deleteInactiveUsers); /*DELETE USERS INACTIVE TWO DAYS*/
usersApiRouter.get("/premium/:uid", usersController.premiumSwitch); /*REFRESH PREMIUM ID */
usersApiRouter.get("/role/:uid", usersController.rolSwitch); /*REFRESH ROL ID */
usersApiRouter.post("/:uid/profile", profileUploader.single("profileImage"), usersController.postDocuments); /*LOAD IMG USER PROFILE */
usersApiRouter.delete("/:_id", usersController.delete); /*DELETE USER ID */