
import BaseController from "../core/BaseController.js";
import { validationResult, body} from 'express-validator'
import { log,getEnv,random, stringify } from "../core/utils.js";
import Translate from "../core/Translate.js";
import { Redis } from "../global.js";
import Crypto from "../core/Crypto.js";
import DateTime from "../core/DateTime.js";


const state = [
    {"id" : 1 , "title" : "A"},
    {"id" : 2 , "title" : "B"},
    {"id" : 3 , "title" : "C"},
    {"id" : 4 , "title" : "D"},
    {"id" : 5 , "title" : "E"},
    {"id" : 6 , "title" : "F"},
    {"id" : 7 , "title" : "G"},
    {"id" : 8 , "title" : "H"},
    {"id" : 9 , "title" : "J"}

]

class testController extends BaseController{

    constructor(){
        super();
    }

    async index(req,res){
        try{
            const catchState = await Redis.get('catch_State');
            if(catchState){
                return res.json(catchState);
            }{
                await Redis.set('catch_State' , state);
                return res.json(catchState);

            }
        }catch(e){
            return super.errorHandling(e);
        }
    }

}

export default testController;