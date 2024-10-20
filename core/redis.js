import ioredis, { Command } from "ioredis";
import { log, stringify, toNumber ,isJSON, toJSON} from "./utils.js";



class Redis{
    #uri= null;
    #redis = null;
    constructor(){
    }

    
    async connect(uri){
        try{
            this.#uri= uri;
            this.#redis = new ioredis(this.#uri, {
                lazyConnect : true
            });
            await this.#redis.connect();
            return true
        }catch(e){
            log(e.toString())
            return false
            
        }
    }
    get redis()
    {
        return this.#redis;
    }
    async set(key , data , EX){
        try{
            data = (typeof data === "string")? data : stringify(data);
            const ex = (toNumber(EX) > 0)? toNumber(EX) : 0;
            if(ex)
                this.#redis.set(key, data , "EX" , ex);
            else
                this.#redis.set(key, data);
        }catch(e){
            log(e.toString());
            return false;
        }
    }
    async get(key){
        try{
            const result = await this.#redis.get(key);
            if(result){
                return (isJSON(result)) ? toJSON(result): result
            }else{
                return '';
            } 
        }catch(e){
            return '';
        }
    }

    async del(key){
        try{
            await this.#redis.del(key);
            return true;
        }catch(e){
            return false;
        }
    }
    async keys(key){
        try{
            const res = await this.#redis.keys(key);
            return res;
        }catch(e){
            return [];
        }
    }
    async hset(key , data={}, ex=0){
        try{
            await this.#redis.hset(key, data);
            if(ex > 0)
                this.#redis.expire(key , ex);
            return true;
        }catch(e){
            return false
        }
    }
    async gethash(key){
        try{
            
            return this.#redis.hgetall(key);
            
        }catch(e){
            return false
        }
    }
    async delhash(key,...fields){
        try{
            
            return this.#redis.hdel(key,...fields);
            
        }catch(e){
            return false
        }
    }
    async ftCreate(indexName , keySpace, schema){
        try{
            //[`FT.CREATE ${keySpace} ON hash PREFIX ${keySpace} SCHEMA ${shema}`]
            // const result = await this.#redis.call('FT.INFO' , indexName , 'utf-8');
            // log(result)
            // if(Array.isArray(result) && result.length == 0){
            //     const cmd = new Command('FT.CREATE' , [indexName , 'ON' ,'HASH', 'PREFIX' , 1 , keySpace, 'SCHEMA',shema.split(" ")], 'utf-8');
            //     await this.#redis.sendCommand(cmd);
            //     log(`${indexName} is ready`);
            // }else{
            //     log('not ok')
            // }


            // try{
                // const result = await this.#redis.call('FT.INFO' , indexName , 'utf-8');
                // log(`${indexName} is ready`)

                    
            // }catch(e){
            //     const cmd = new Command('FT.CREATE' , [indexName , 'ON' ,'HASH', 'PREFIX' , 1 , keySpace, 'SCHEMA',shema.split(" ")], 'utf-8');
            //     await this.#redis.sendCommand(cmd);
            //     log("ok")
            //     log(`${indexName} is maked`);
            // }
            ///////////////////
            await this.ftDropIndex(indexName);
            const cmd = new Command('FT.CREATE'
            ,[indexName,'ON','HASH','PREFIX',1,keySpace,'SCHEMA',schema.split(' ')],'utf-8');
            await this.#redis.sendCommand(cmd);

        }catch(e){
            log("ftCreate Error : " + e.toString());
            return false
        }
    }
    async ftDropIndex(indexName){
        try{
            const cmdDROP = new Command("FT.DROPINDEX" , [indexName] , 'utf-8');
            await this.#redis.sendCommand(cmdDROP);
            return true
            
        }catch(e){
            // log("ftDropIndex Error : " + e.toString());
            return false;
        }
    }
    async ftSearch(indexName,query, params = ''){
        try{
            const paramEnd = (params.length === 0) ? [] : params.split(' ');
            const result = await this.#redis.call("FT.SEARCH" , indexName , query, paramEnd);
            return this.#toObject(result);
            // return result
            
        }catch(e){
            return {};
        }
    }
    #toObject(data = []){
        try{
            if(data.length === 1){
                return {"count" : data[0], rows : [] };
            }else{
                const result = {"count" : data[0] , rows : []};
                data.shift();
                
                let item = {};
                let rows = [];
                for(let row of data){
                    if(typeof row === "string"){
                        item.key = row;
                    }else if(typeof row === "object"){
                        for(let i = 0 ; i < row.length ; i+=2){
                            const key = row[i];
                            const value = row[i+1];
                            item[`${key}`] = value;
                        }
                        rows.push(item);
                        item = {};
                    }
                    
                }
                result.rows = rows;
                return result

            }

        }catch(e){
            log(e)
            return {};
        }
    }  
}




export default Redis;