import crypto from 'crypto';
import { getEnv,log } from './utils.mjs';

class Crypto{
    
    #secretKey = '';

    constructor(){
        
        this.#secretKey = getEnv('SECRET-KEY');
        log(this.#secretKey);
    }

    hash(str){
        try{
            return crypto.createHmac('sha256',this.#secretKey)
                .update(str.toString()).digest('hex');
        }catch(e){
            return '';
        }
    }


    tobase64(str){
        try{
            return Buffer.from(str.toString()).toString('base64url');
        }catch(e){
            return '';
        }
    }


    frombase64(str){
        try{
            return Buffer.from(str.toString(),'base64url').toString('utf8');
        }catch(e){
            return '';
        }
    }

    encryption(key,data){
        try{
            const hashkey = this.hash(key);
            const key2 = hashkey.substring(hashkey,32);
            log('key + '+key2);
            const iv = hashkey.slice(32,-16)
            log('iv + '+iv)
            const data2 = {
                'a' : Math.random(),
                'message' : data,
                'z' : Math.random()
            };
            const dataFinal = JSON.stringify(data2)
            const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(key2), iv);
            let encrypted = cipher.update(dataFinal,'utf8', 'base64');
            encrypted += cipher.final('base64');
            return this.tobase64(encrypted);
        }catch(e){
            log(e.toString())
            return '';
        }
    }

    decryption(key,data){
        try{
            const hashkey = this.hash(key);
            const key2 = hashkey.substring(0,32);
            const iv = hashkey.slice(32,-16);
            data = this.frombase64(data);
            const decipher = crypto.createDecipheriv('aes-256-cbc',Buffer.from(key2), iv);
            let decrypted = decipher.update(data,'base64', 'utf8');
            decrypted += decipher.final('utf8');
            const decryptedFinal = JSON.parse(decrypted);
            return decryptedFinal?.message ?? '';
            
        }catch(e){
            log(e.toString())
            return '';
        }
    }

}


export default new Crypto()