import Redis from "./core/redis.js";
import MongoDB from './core/Mongodb.js'


const redisObject = new Redis();
const MongoDbObject = new MongoDB();

export {
    redisObject as Redis,
    MongoDbObject as MongoDB
}