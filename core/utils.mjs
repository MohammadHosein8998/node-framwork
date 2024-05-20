import dotenv from 'dotenv'
dotenv.config();


export function log(obj){
    
    console.log(obj);
}

export function getEnv(key, cast='string'){
    const ret = '';
    switch(cast){
        case('number'):
            return toNumber(process.env[key])
        break
        case('boolean'):
            return toBoolean(process.env[key])
        break
        default:
            return process.env[key] ?? '';

    }
    
}

export function toNumber(str){
    try{
        const num = Number(str);
        return isNaN(num) ? 0 : num;
    }catch{
        return 0;
    }

}

export function toBoolean(bool){
    try{
        
        const num = (bool == "true") ?  true : false;
        return num;
    }catch(e){
        return false;
    }

}

export function sleep(ms){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}


export function Random(min, max) {
    try{
        return Math.floor(
            Math.random() * (max - min) + min
        );
    }catch(e){
        return '';
    }
}
  

export function stringify(obj){
    try{
        return JSON.stringify(obj);
    }catch(e){
        log(e);
        return '';
    }
}


export function isJSON(str) {
    var ret = true;
    try {
       JSON.parse(str);
    }catch(e) {
       ret = false;
    }
    return ret;
 }

export function toJSON(str){
    try{
        return JSON.parse(str);
    }catch(e){
        return {};
    }
}
