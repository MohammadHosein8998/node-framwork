import ioRedis from "ioredis";
import { log, toNumber,stringify,toJSON,isJSON } from "./utils.mjs";



class Redis{
    
    
    #URI = null;
    #redis = null

    async connect(URI){
        try{
            
            this.#URI = URI;
        this.#redis = new ioRedis(this.#URI,{lazyConnect: true,
            showFriendlyErrorStack: true
        });
        await this.#redis.connect();
        return true;
       }catch(e){
        return false; 
       }
    }

    async set(key , value={}, ex=0){
        try{
            const data = (typeof value === "string")? value : stringify(value);
            ex = toNumber(ex) > 0 ? ex : 0;
            if(ex > 0){
                await this.#redis.set(key, data, 'EX', ex);
            }else{
                await this.#redis.set(key, data);
            }
        }catch(e){
            log(e);
            return '';
        }
    }

    async get(key){
        try{
            const r = await this.#redis.get(key);
            if(r){
                
                return isJSON(r) ? toJSON(r) : r;
            }else{
                return '';
            }
        }catch(e){
            return '';
        }
    }

    async del(key){
        try{
            const r = await this.#redis.del(key);
            
            return true
            
        }catch(e){
            return false;
        }
    }

    async keys(pattern){
        try{
            return await this.#redis.keys(pattern);
        }catch(e){
            return [];
        }
    }

    async Hset(key,data={}, ex){
        try{
            ex = toNumber(ex) > 0 ? ex : 0;
            if(ex > 0){
                await this.#redis.expire(key,ex);
                
            }else{
                await this.#redis.hset(key,data);
            }
        }catch(e){
            return '';
        }
    }


    async getHash(key){
        try{
           return await this.#redis.hgetall(key);
            
        }catch(e){
            return '';
        }
    }

    async Hdel(key, ...field){
        try{
           return await this.#redis.hdel(key, field);
           return true;
            
        }catch(e){
            return false;
        }
    }
}


const RedisObject = new Redis();

export { RedisObject as Redis};