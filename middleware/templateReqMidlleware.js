import BaseMiddleware from "../core/BaseMiddleware.js";
import { getEnv, log } from "../core/utils.js";

export default class templateReqMidlleware extends BaseMiddleware {
   constructor(){
      super();
   }
     async handle(req,res,next){
        try{
           req.app.set("req" , req);
           next();
        }catch(e){
           next()
        }
  }



}