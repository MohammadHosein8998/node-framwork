import BaseMiddleware from "../core/BaseMiddleware.js";
import { getEnv, log } from "../core/utils.js";
import fileUpload from 'express-fileupload';

import expressSession from "express-session";

export default class fileUploadMidlleware extends BaseMiddleware {
   constructor(){
      super();
   }

   async handle(req,res,next){
      try{
         fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        })(req ,res ,next);
      }catch(e){
         super.toError(e,req , res);
      }
}
}
