import { log,getEnv, sleep, random } from "./core/utils.js";
import express from "express";
import nunjucks from 'nunjucks';
import Translate from "./core/Translate.js";
import * as fs from './core/fs.js'
import crypto from "./core/Crypto.js";
import DateTime from "./core/DateTime.js";
import {MongoDB, Redis} from "./global.js";
import * as templateHelper from './core/templateHelper.js';
import templateReqMidlleware from "./middleware/templateReqMidlleware.js";
import sessionMidlleware from "./middleware/sessionMidlleware.js";
import fileUploadMidlleware from "./middleware/fileUploadMidlleware.js";






class Aplication{
    #app = null;
    #templateEnginge = null;
    async #initExpress(){
        try{
            this.#app = express()
            this.#app.use(express.static('assets'));
            this.#app.use(express.static('media'));
            this.#app.use(express.urlencoded({extended : true , limit : '10mb'}));
            this.#app.use(express.json({limit : '10mb'}));  
            this.#app.use(new sessionMidlleware().handle);
            this.#app.use(new fileUploadMidlleware().handle);
            this.#app.use(new templateReqMidlleware().handle);
            this.#initTemplateEngine();
        }catch(e){
            log(`ERROR on : initExpress ${e.toString()}`);
        }
    }
    #initTemplateEngine(){
        try{
            const template_dir = 'templates/' + getEnv("TEMPLATE") + '/';
            this.#templateEnginge = nunjucks.configure(template_dir ,  {
                autoescape : true,
                express : this.#app,
                noCache : false
            });
            this.#app.set('view engine' , 'html');
            this.#templateEnginge.addGlobal('t',Translate.t);
            this.#templateEnginge.addGlobal("APP_URL", getEnv('APP_URL'));
            this.#templateEnginge.addGlobal("TEMPLATE_NAME",  getEnv('TEMPLATE') + "/");
            this.#templateEnginge.addExtension('alertDangerExtension', new templateHelper.alertDangerExtension());
            this.#templateEnginge.addExtension('alertSuccessExtension', new templateHelper.alertSuccessExtension());

            
        }
        catch(e){
            log(`ERROR on : initTemplateEngine ${e.toString()}`);
        }
    }

    async #initRoute(){
        try{
            const Error404 =  (await import("./controllers/Error404.js")).default;
            const Error500 =  (await import("./controllers/Error500.js")).default;
            const Route = (await import("./routes/Route.js")).default;
            log("route is running");
            this.#app.use('/', Route);
            this.#app.use(new Error404().handle);
            this.#app.use(new Error500().handle);
            
        }catch(e){
            log(`ERROR on : initRoute : ${e.toString()}`);
            
        }
    }
    async init(){
        try{
            const redisStatus = await Redis.connect(getEnv('REDIS_URI'));
            if(!redisStatus){
                log('Redis can not connect!!');
                process.exit(-1);
            }

            const mongodbStatus = await MongoDB.connect(getEnv('MONGODB_URI'));
            if(!mongodbStatus)
            {
                log(`monogdb Can not Connect!`);
                process.exit(-1);
            }
            
            await this.#initExpress();        
            await this.#initRoute();
            
        }catch(e){
            log(`ERROR on : init : ${e.toString()}`);
        }
    }
    
    async run(){
        try{
            log("app is running");
            
            await this.init();
            await Redis.ftCreate("user" , "user:" , 'id TEXT SORTABLE username TEXT SORTABLE password TEXT SORTABLE');
            /*
            await Redis.hset("user:2" , {'id' : 2, 'username' : 'mahyar' ,'password' : 12345});
            await Redis.hset("user:3" , {'id' : 3, 'username' : 'mohammad' ,'password' : 123});
            await Redis.hset("user:4" , {'id' : 4, 'username' : 'meisam' ,'password' : 1378});
            await Redis.hset("user:5" , {'id' : 5, 'username' : 'ali' ,'password' : 545});
            await Redis.hset("user:6" , {'id' : 6, 'username' : 'reza' ,'password' : 'sjhoijs44'});
            await Redis.hset("user:7" , {'id' : 7, 'username' : 'hassan' ,'password' : 'oopks448486177sd'});
            await Redis.hset("user:8" , {'id' : 8, 'username' : 'fdssdf' ,'password' : 'sdfsd~!df'});
            await Redis.hset("user:9" , {'id' : 9, 'username' : 'kfg' ,'password' : 123});
            await Redis.hset("user:1" , {'id' : 1, 'username' : 'asd' ,'password' : 234});
            await Redis.hset("user:11" , {'id' : 11, 'username' : 'ert' ,'password' : 123});
            await Redis.hset("user:12" , {'id' : 12, 'username' : 'tyu' ,'password' : 8881238});
            const result5 = await Redis.ftSearch('user'
                ,'@username:mohammad @password:123');
            log(result5);
            */

            
            
            this.#app.listen(getEnv("PORT" , 'number') , async ()=>{
                log(`app is running in port ${getEnv("PORT")}`);
            });
        }catch(e){
            log(`ERROR on : run : ${e.toString()}`);
            
        }
    }
}

export default Aplication;