import BaseMiddleware from "../core/BaseMiddleware.js";
import { getEnv, log } from "../core/utils.js";
import expressSession from 'express-session';
import redisStore from 'connect-redis';
import {Redis} from "../global.js";



export default class sessionMidlleware extends BaseMiddleware {
   
   constructor(){
      super();
   }
   
   async handle(req,res,next){
      try{
         const RedisStore = new redisStore({ client: Redis.redis } );
         expressSession({
         store: RedisStore,  
         secret: getEnv("SESSION_SECRET"),
         name : getEnv("SESSION_NAME"),   
         resave: false,
         saveUninitialized: true,
         cookie: { 
            httpOnly : true,
             secure : getEnv('SESSION_SECURE','bool'),
             maxAge : getEnv('SESSION_EXPIRE', 'number') * 1000 * 60 ,
             sameSite : getEnv('SESSION_SAMESITE')
            }
         })(req, res, next);

      }catch(e){
         return super.toError(e, req ,res);
         
      }
   }
}