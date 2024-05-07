import autoBind from "auto-bind"
import {getEnv, log} from './utils.mjs'


export default class BaseContoller{

    constructor(){
        if(this.constructor === BaseContoller ){
            throw new Error("BaseContoller is an abstact class!!")
        }
        autoBind(this);

    }

    toError(error,req ,res){
        try{
            
            if(getEnv("DEBUG",'boolean'))
                return res.status(500).send(error.toString());
            else
                return res.status(500).send('internal server Error!!');
        }catch(e){
            return res.status(500).send(e.toString());
        }
    }

    async input(param){
        try{
            const r = Array.isArray(param) ? '' : param;
            
                if(typeof r === 'string'){
                    return r;
                }else{
                    return '';
                }
            }catch(e){
                return '';
            }
    }
    
}