import { Router } from "express";
import userRoute from './user.js';
import testRoute from './test.js';


const route = Router();
try{
    route.use('/',userRoute);
    route.use('/test',testRoute);

}catch(e){
    console.log(e.toString());
}   

export default route;