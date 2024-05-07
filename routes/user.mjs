import { Router } from "express";
const route = Router();
import userController from "../controllers/userController.mjs";

route.get("/login" , userController.login);



export default route;


