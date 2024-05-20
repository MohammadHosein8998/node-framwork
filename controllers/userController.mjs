import { log } from "../core/utils.mjs";
import BaseContoller from "../core/BaseContoller.mjs";
import {query,validationResult} from "express-validator"
import Translate from "../core/Translate.mjs";
import { use } from "i18next";
import { Redis } from "../core/redis.mjs";


class userController extends BaseContoller{


    constructor(){
        super();
    }

    async #loginValidation(req){
        const e = await query('email').not().isEmpty().withMessage('pleas enter email!')
        .isEmail().withMessage("email is not valid").run(req);
        const r = await query('username').not().isEmpty().withMessage('pleas enter username!')
        .isString().withMessage('pleas enter an string!').run(req);
        const p = await query('password').not().isEmpty().withMessage('pleas enter password!').run(req);


        return validationResult(req).errors;
    }


    async login(req,res){
        try{
            const result = await this.#loginValidation(req);
            if(result.length !== 0){    
                console.log(result)
                return res.send(`${result[0]?.msg }`);
            }
            const data = {
                'username' : await Redis.get('q101')
            };
            log(data)
            return res.render(`user/login.html`,data);
        }catch(e){
            return super.toError(e,req,res);
        }
    }
}


export default new userController();


