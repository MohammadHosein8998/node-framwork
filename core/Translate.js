import i18next from "i18next";
import { getEnv, log } from "./utils.js";
import fa from "../language/fa/fa.js";
import en from "../language/en/en.js";


class Translate{


    constructor(){
        i18next.init({
            resources : {
                fa : {
                    translation : fa
                },
                en : {
                    translation : en
                }
            }
        });
        this.changeLanguage(getEnv("APP_LANG"))
    }


    changeLanguage(lang){
        i18next.changeLanguage(lang); 
    }

    t(key, data={}){
        return i18next.t(key, data)
    }
}


export default new Translate();