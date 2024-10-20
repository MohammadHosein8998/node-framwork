import { Router } from "express";
import testController from "../controllers/testController.js";

const TestController = new testController();
const route = Router();
try{
    route.get("/" , TestController.index);

}catch(e){
    route.use(TestController.errorHandling(e))
}


export default route;