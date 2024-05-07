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




log(Crypto.encryption('meisam123','salam be hame'));
//cW1oM3dkL1huaGV4OWZBVE1hK0g3dz09
log(Crypto.decryption('meisam123','djlteUN0Zmo1VWxzUlZmYjA0ZFRkbTh5L0lMaC9pZERqNXNDWElPRVRoN2FPNHBYSkhjenVQeFhjdmtLZFVzYnVXQkZaTzB3UXRkV1k5Y2RnczNlb0VmUktTa3A1YTR6N2RqWG5VOHJ5S0E9'));


// log(fs.fielExsist('./a'))
// log(fs.fielExsist('./b'))
// log(fs.unlink('./b'))





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
        const PORT = getEnv('PORT','number');
        this.#app.listen(PORT, () => {
            log(`app listening on port ${PORT}`);
          })
    }

}

export default new application();