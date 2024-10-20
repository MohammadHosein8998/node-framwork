import BaseMiddleware from "../core/BaseMiddleware.js";
import { getEnv, log } from "../core/utils.js";
import {RateLimiterRedis} from 'rate-limiter-flexible'
import { Redis } from "../global.js";
import expressSession from "express-session";

export default class rateLimiterRedis extends BaseMiddleware {
   #rateLimiterRedis = null;
   
   constructor(key, points , durationSecond, blockDurationSecond = 60){
      super();
      const opts = {
         // Basic options
         storeClient: Redis.redis,
         keyPrefix: key, // must be unique for limiters with different purpose
         points: points, // Number of points
         duration: durationSecond, // Per second(s)
         blockDuration: blockDurationSecond, // Do not block if consumed more than points
       };
      this.#rateLimiterRedis = new RateLimiterRedis(opts);
   
   }
   async handle(req,res,next){
      try{
         this.#rateLimiterRedis.consume(req.ip)
         .then(() => {
            next();
         }).catch(() => {
            res.status(429).send("you blocked :  retry after 1 minute :)");
         });
      }catch(e){
         super.toError(e,req , res);
      }
   }

}
