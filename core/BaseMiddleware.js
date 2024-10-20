import autoBind from "auto-bind";
import { getEnv, log } from "./utils.js";

export default class BaseMiddleware{

    constructor(){
        if(this.constructor === BaseMiddleware){
            throw new Error("BaseMiddleware is an abstarct class and cant have instance");
        }
        autoBind(this);
    }
    input(feild){
        try{
            if(!Array.isArray(feild)){
                if(typeof feild === 'string'){
                    return feild.trim();
                }else{
                    return '';
                }
            }else{
                return '';
            }
        }catch(e){
            return '';
        }
    }
    

    errorHandling(error){
        try{
            const debug = getEnv('DEBUG' , 'bool');
            return async (req, res , next) => {
                if(debug){
                    return res.status(400).send(error.toString());
                }
                else{
                    return res.status(500).send("Internal server Error");
                }
            }
        }catch(e){
            log(`ERROR on : BaseController : errorHandling ${e.toString()}`);
            throw e;
        }
    }

    toError(err , req ,res){
        const debug = getEnv('DEBUG' , 'bool');
        try{
            if(debug){
                return res.status(500).send("Basemiddleware  : " + err.toString());
            }
            else{
                return res.status(500).send("Internal server Error");
            }
    
        }catch(e){
            if(debug){
                return res.status(500).send(e.toString());
            }
            else{
                return res.status(500).send("Internal server Error");
            }
        }
    }
}