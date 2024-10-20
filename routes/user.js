import { Router } from "express";
import userController from "../controllers/userController.js";
import authmiddleware from "../middleware/auth.js";
import { log } from "../core/utils.js";
import rateLimiterRedis from "../middleware/rateLimitter.js";


const UserController = new userController();
const route = Router();
try{
    route.get("/" , new rateLimiterRedis("user_index" , 5 ,60).handle, new authmiddleware().checkAuth , UserController.index);
    route.post("/" , new rateLimiterRedis("user_index" , 5 ,60).handle , new authmiddleware().checkAuth ,  UserController.login);
    route.get("/recovery" ,new authmiddleware().isAuth,  UserController.recovery);
    route.post("/recovery" ,  UserController.postRecovery);   
    route.get("/register", new authmiddleware().checkAuth  ,  UserController.register);   
    route.post("/register" ,  UserController.postRegister);  
    route.get("/profile" ,new authmiddleware().isAuth ,  UserController.profile); 
    route.get("/logout" ,new authmiddleware().isAuth ,  UserController.logout);

}catch(e){

    route.use(UserController.errorHandling(e));
}

export default route;
