import BaseMiddleware from "../core/BaseMiddleware.js";
import { getEnv, log } from "../core/utils.js";




export default class authMidlleware extends BaseMiddleware {
   
   constructor(){
      super();
   }
   
   async checkAuth(req,res,next){
      try{
         log('isAuth is call');
         if(req?.session?.user_id){
            return res.redirect(`${getEnv('APP_URL')}profile`);
        }else{
            next()
        }
      }catch(e){
         return super.toError(e, req ,res);
         
      }
   }
   async isAuth(req,res,next){
      try{
         log('isAuth is call');
         if(req?.session?.user_id){
            next();
         }else{
            return res.redirect(`${getEnv('APP_URL')}?msg=no_access`);
        }
      }catch(e){
         return super.toError(e, req ,res);
         
      }
   }
}
