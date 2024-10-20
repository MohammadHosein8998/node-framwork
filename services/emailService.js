import { log , getEnv, toJSON , sleep} from "../core/utils.mjs";
import Redis from "../core/redis.mjs";

class emailService{
    #redis = null;
    #redis2 = null;

    constructor(){
        log('emailService is running ....');
    }
    async run(){
        try{
            this.#redis = new Redis();
            this.#redis2 = new Redis();

            const redisStatus = await this.#redis.connect(getEnv('REDIS_URI'));
            if(!redisStatus){
                log('Redis can not connect!!');
                process.exit(-1);
            }

            const redisStatus2 = await this.#redis2.connect(getEnv('REDIS_URI'));
            if(!redisStatus2){
                log('Redis2 can not connect!!');
                process.exit(-1);
            }
            // await this.loop();

            await this.#redis.redis.subscribe('__keyspace@0__:email_list');
            await this.#redis.redis.on("message", async (channel, message) => {
                try{
                    if(message == 'rpush'){
                        log(`channel => ${channel}`);
                        log(`message => ${message}`);
                        const item = await this.#redis2.redis.lpop("email_list");
                        if(item){
                            const data = toJSON(item)
                            log(item);
                            await sleep(data?.sleep);
                            log(`email send to ${data?.email}`);
                        }
                    }
                    }catch(e){
                        log(`subscribe ERROR : ${e.toString()}`)
                    }
            })


        }catch(e){
            log(`emailService Error : ${e.toString()}`)
        }
    }
    async loop(){
        try{
            
            this.loop();
        }catch(e){
            log(`loop Error : ${e.toString()}`)
        }
    }
}


async function main(){
    try{
        const emailServiceObject = new emailService();
        await emailServiceObject.run();
        
        log(`main is running`)
       

    }catch(e){
        log(`main Error : ${e.toString()}`)
    }
}

main();