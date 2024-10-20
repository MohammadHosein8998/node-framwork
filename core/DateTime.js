import moment from "moment";
//dont delete moment_timezone : below line
import moment_timezone from 'moment-timezone'
import { getEnv, log } from "./utils.js";
import momentJalaali from "moment-jalaali";

class DateTime{
    #timeZone = null;
    constructor(){
        this.#timeZone = getEnv('TIME-ZONE');
    }

    getTimeStamp(){
        try{
            return moment.tz(this.#timeZone).unix();
        }catch(e){
            return '';
        }
    }
    toString(format= 'YYYY-MM-DD HH:mm:ss'){
        try{
            return moment.tz(this.#timeZone).format(format);
        }catch(e){
            return '';
        }
    }
    toDateTme(DateTime = ''){
        try{
            return (DateTime !== '') ? moment.tz(DateTime , this.#timeZone) : moment.tz(this.#timeZone);
            
        }catch(e){
            return null;
        }
    }

    toJalaali(str , format = "jYYYY:jMM:jDD"){
        try{
            return momentJalaali(str).format(format);
        }catch(e){
            return '';
        }
    }
    toGregorian(str , format = "YYYY:MM:DD"){
        try{
            return momentJalaali(str,"jYYYY:jMM:jDD").format(format);
        }catch(e){
            return '';
        }
    }
}

export default new DateTime();