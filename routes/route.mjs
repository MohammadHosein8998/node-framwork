import { Router } from "express";
import userRoute from './user.mjs';
import testRoure from './test.mjs';




const route = Router();

route.use('/user' , userRoute);
route.use('/test' , testRoure);


export default route;


