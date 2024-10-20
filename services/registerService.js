import { log , getEnv, toJSON , sleep} from "../core/utils.js";
import Redis from "../core/redis.js";

class registerService{
    #redis = null;
    constructor(){
        log('register service is running ....');
    }
    async run(){
        try{
            this.#redis = new Redis();
            const redisStatus = await this.#redis.connect(getEnv('REDIS_URI'));
            if(!redisStatus){
                log('Redis can not connect!!');
                process.exit(-1);
            }
            
            await this.#redis.redis.subscribe('news1');
            this.#redis.redis.on("message" , async (channal , message) =>{
                log(`channal => ${channal}`);
                log(`message => ${message}` );
            });
        }catch(e){
            log(`register service Error : ${e.toString()}`)
        }
    }
    




}


async function main(){
    try{
        const registerServiceObject = new registerService();
        await registerServiceObject.run();
        
        log(`main is running`)
       

    }catch(e){
        log(`register Service Error : ${e.toString()}`)
    }
}

main();