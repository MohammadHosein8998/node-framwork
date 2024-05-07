import { log } from "../core/utils.mjs";
import BaseContoller from "../core/BaseContoller.mjs";


class Error404Controller extends BaseContoller{


    constructor(){
        super();
    }

    async handle(req,res){
        try{
            return res.status(404).send('error 404 page not found!!');
        }catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default new Error404Controller();


