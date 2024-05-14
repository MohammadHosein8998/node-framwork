import { log,getEnv,sleep } from "./core/utils.mjs";
import express from "express";
import fileUpload from 'express-fileupload'
import route from "./routes/route.mjs";
import nunjucks from 'nunjucks';
import Error500 from "./controllers/Error500Controller.mjs";
import Error404 from "./controllers/Error404Controller.mjs";
import Translate from "./core/Translate.mjs";
import * as fs from './core/fs.mjs';
import Crypto from "./core/Crypto.mjs";
import dateTime from "./core/dateTime.mjs";








class application{

    #app = null;
    #templateEngine = null;
    
    constructor(){
        this.#initExpress();
        this.#initRoute();
    }
    async #initExpress(){
        log('Express is running!!');
        this.#app = express();
        this.#app.use(express.static('assets'));
        this.#app.use(express.static('media'));
        this.#app.use(express.urlencoded({extended : true , limit : '10mb'}));
        this.#app.use(express.urlencoded({ limit : '10mb'}));
        const templateDir = 'templates/' + getEnv('TEMPLATE') + '/';
        log(templateDir)
        this.#app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
        this.#templateEngine = nunjucks.configure(templateDir,{
            autoescape : false,
            express : this.#app,
            noCache : false     
            
        });
        this.#templateEngine.addGlobal('t',Translate.t);
    }

    async #initRoute(){
            this.#app.use('/', route);
            this.#app.use(Error404.handle);
            this.#app.use(Error500.handle);

    }
    
    async run(){
        log('aplication is running!!');
        log(dateTime.getTimeStamp());
        log(dateTime.toString());
        log(dateTime.toDateTime("2020-01-05 20:10:25").add('5', "year").add('6', 'h').format("YYYY:MM:DD HH:MM:SS"));
        log(dateTime.toJalaali('1999-10-27 20:10:25'));
        log(dateTime.toGreGorian('1378:08:05'));
        const PORT = getEnv('PORT','number');
        this.#app.listen(PORT, () => {
            log(`app listening on port ${PORT}`);
          })
    }

}

export default new application();