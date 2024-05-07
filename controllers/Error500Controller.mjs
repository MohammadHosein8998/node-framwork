import { log } from "../core/utils.mjs";
import BaseContoller from "../core/BaseContoller.mjs";


class Error500Controller extends BaseContoller{


    constructor(){
        super();
    }

    async handle(error,req,res,next){
        try{
            return super.toError(error,req,res);
        }catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default new Error500Controller();


