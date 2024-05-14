import moment from "moment";
import momentTimeZone from "moment-timezone";
import { getEnv } from "./utils.mjs";
import momentJalali from 'moment-jalaali';

class DateTime{
    #timeZone = null;
    constructor(){
        this.#timeZone = getEnv("TIME-ZONE");
    }

    getTimeStamp(){
        try{

            return  moment.tz(this.#timeZone).unix();  

        }catch(e){
            return 0;
        }
    }
    toString(format = "YYYY:MM:DD HH:MM:SS"){
        try{
            return  moment.tz(this.#timeZone).format(format); 
        }catch(e){
            return '';
        }
    }

    toDateTime(dateTime = ""){
        try{
            return (dateTime == '')?  moment.tz(this.#timeZone):  moment.tz(dateTime,this.#timeZone); 
        }catch(e){
            return null;
        }
    }

    toJalaali(str , format = 'jYYYY:jMM:jDD'){
        try{
            return momentJalali(str).format(format);
        }catch(e){
            return '';
        }
    }

    toGreGorian(str , format = 'YYYY:MM:DD'){
        try{
            return momentJalali(str,'jYYYY:jMM:jDD').format(format);
        }catch(e){
            return '';
        }
    }
}


export default new DateTime();