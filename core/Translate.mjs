import i18next from "i18next";
import fa from "../langs/fa/fa.mjs";
import en from "../langs/en/en.mjs";
import { getEnv, log } from "./utils.mjs";

class Translate{

    constructor(){
        this.#initI18next();
        this.changeLanguage(getEnv('APP-LANG'));
        
    }

    changeLanguage(lang){
        // log(fa)
        i18next.changeLanguage(lang);
    }

    t(key,data={}){
        return i18next.t(key,data);
    }

    #initI18next(){
        i18next.init({
            resources : {
                fa : {
                    translation : fa
                }
            },
            resources : {
                en : {
                    translation : en
                }
            }
        });
    }
}



export default new Translate();