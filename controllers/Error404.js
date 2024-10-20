import { query } from "express";
import BaseController from "../core/BaseController.js";

class Error500Controller extends BaseController{

    constructor(){
        super();
    }

    async handle(req,res, next){
        try{
            return res.status(404).render(`404`);
        }catch(e){
            return super.toError(e, req ,res);
        }
    }
}

export default Error500Controller;