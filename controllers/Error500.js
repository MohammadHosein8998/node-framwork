import { query } from "express";
import BaseController from "../core/BaseController.js";


class Error500Controller extends BaseController{

    constructor(){
        super();
    }

    async handle(error, req,res){
        try{
            return super.toError(error, req ,res);
        }catch(e){
            super.toError(e, req ,res);
        }
    }
}

export default Error500Controller;