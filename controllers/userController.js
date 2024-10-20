
import BaseController from "../core/BaseController.js";
import { validationResult, body, param} from 'express-validator'
import { log,getEnv,random, stringify } from "../core/utils.js";
import Translate from "../core/Translate.js";
import { Redis } from "../global.js";
import Crypto from "../core/Crypto.js";
import DateTime from "../core/DateTime.js";;
import UserModel from './../models/user.js';


class userController extends BaseController{

    constructor(){
        super();
        this.model = new UserModel();
    }
        /** 
    * @param {Object} req - clinet request  
    */
    async #loginValidation(req){
        try{
            await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
            await body('password').not().isEmpty().withMessage("err3")
            .run(req);
            return validationResult(req)
        }catch(e){
            return {};
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req  
    * @param {Object} req.session - session of req  
    * @param {Object} res - server request
    */
    async login(req , res){
        try{
            
            const result = await this.#loginValidation(req);
            if(!result.isEmpty()){
                return res.redirect(`/?msg=${result?.errors[0].msg}`);
            };

            const email = super.input(req.body.email);
            const password = super.input(req.body.password);
            const hashEmail = Crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            
            if(user.email == email && password === user.password){

                // const data = {
                //     "email" : email,
                //     "id" : hashEmail,
                //     "password" : password
                // }
                // Redis.set(`user_${hashEmail}`, data);
                req.session.user_id = user?.id;
                log("id : " + req.session.id);
                log("user_id : " + req.session.user_id);
                return res.redirect(`/profile`);
            }else{
                return res.redirect('/?msg=err4');
            }
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req  
    * @param {Object} req.session - session of req    
    * @param {Object} res - server request
    */
    async index(req,res){
        try{
            // const result = await this.#LoginValidation(req);
            // if(!result.isEmpty()){
            //     return res.send(result?.errors[0].msg);
            // };
            
            if(req?.session?.user_id){
                return res.redirect(`profile`);
            }
            const data = {
                "title" : Translate.t('user.title')
            }
            return res.render("user/index.html",data)
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }
   
    /** 
    * @param {Object} req - clinet request  
    * @param {Object} res - server request
    */
    async recovery(req,res){
        try{
            const data = {
                'username' : Translate.t("username"),
                'register' : Translate.t("user.register"),
                "title" : Translate.t('user.recovery'),
                'user' : await Redis.get("q101")
            }
            return res.render("user/recovery.html",data)
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }

/** 
    * @param {Object} req - clinet request
    */
    async #recoveryValidation(req){
        try{
            await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
            return validationResult(req)
        }catch(e){
            return {};
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req 
    * @param {Object} res - server request
    */
    async postRecovery(req , res){
        try{
            const result = await this.#recoveryValidation(req);
            if(!result.isEmpty()){
                return res.redirect(`/recovery?msg=${result?.errors[0].msg}`);
            };

            const email = super.input(req.body.email);
            const hashEmail = Crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            if(user.id){
                const resetkey = await Redis.get(`reset_${hashEmail}`);

                if(resetkey === ''){
                    const token = Crypto.hash(email + random(1000000 , 99999999) + DateTime.getTimeStamp() + random(1000000 , 99999999));
                    const data = {
                        "email" : email,
                        "id" : hashEmail,
                        "token" : token
                    }
                    Redis.set(`reset_${hashEmail}`, data , 60 * 2);
                    return res.redirect('/recovery?msg=ok');
                    
                }else{
                    return res.redirect('/recovery?msg=reset-wait');
                }
            }else{
                
                return res.redirect('/recovery?msg=notEmail');
            }
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }


/** 
    * @param {Object} req - clinet request 
    * @param {Object} res - server request
    */
    async register(req,res){
        try{
            const data = {
                'username' : Translate.t("username"),
                'register' : Translate.t("user.register"),
                "title" : Translate.t('user.register'),
                'user' : await Redis.get("q101")
            }
            return res.render("user/register.html",data)
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req
    * @param {Object} res - server request
    */
    async #registerValidation(req){
        try{
            await body('email').not().isEmpty().withMessage("err1")
            .isEmail().withMessage("err2")
            .run(req);
            await body('password1').not().isEmpty().withMessage("err3")
            // .isStrongPassword({minLength: 8 , minLowercase : 1 , minUppercase : 1 , minSymbols : 1})
            // .withMessage("pass-valid")
            .run(req);
            await body('password2').not().isEmpty().withMessage("err4")
            .run(req);
            return validationResult(req)
        }catch(e){
            return {};
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req  
    * @param {Object} res - server request
    */
    async postRegister(req , res){
        try{
            const result = await this.#registerValidation(req);
            if(!result.isEmpty()){
                return res.redirect(`/register?msg=${result?.errors[0].msg}`);
            };

            const email = super.input(req.body.email);
            const password1 = super.input(req.body.password1);
            const password2 = super.input(req.body.password2);
            
            if(password1 != password2){
                return res.redirect(`/register?msg=err5`);
            }

            const resultDB = await this.model.register(email, password2)
            res.send('ok');


            /*
            const hashEmail = Crypto.hash(email);
            const user = await Redis.get(`user_${hashEmail}`);
            if(user === ""){
                const data = {
                    "email" : email,
                    "id" : hashEmail,
                    "password" : password2
                }
                const userData = {
                    'email' : email,
                    'sleep' : random(1000,20000)
                }
                Redis.set(`user_${hashEmail}`, data);
                Redis.redis.rpush('email_list', stringify(userData));
                Redis.redis.publish("news1" , `register a new user => ${email} on ${DateTime.toJalaali()}`);
                return res.redirect('/register?msg=ok');
            }else{
                return res.redirect('/register?msg=already-email'); 
            }*/
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }

    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.session - session of req    
    * @param {Object} res - server request
    */
    async profile(req,res){
        try{
            if(req.session.user_id){
                // log("id : " + req.session.id);
                // log(req.session)
                // log("user_id : " + req.session.user_id);
                const id = req.session.user_id
                const user = await Redis.get(`user_${id}`);
                const data = {
                    "title" : "profile",
                    "user" : user
                };
            return res.render("user/profile.html" , data);
            }else{
                return res.redirect("/?msg=no_access")
            }
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }
    
    /** 
    * @param {Object} req - clinet request
    * @param {Object} req.body - boddy of req  
    * @param {Object} req.session - session of req    
    * @param {Object} res - server request
    */
    async logout(req,res){
        try{
            if(req?.session?.user_id){
                delete req?.session?.user_id;
                req.session.destroy();
                
                return res.redirect("/?msg=logout-success")

            }else{
                return res.redirect("/?msg=no_access")
            }
            
        }catch(e){
            return super.toError(e,req ,res);
        }
    }

}

export default userController;