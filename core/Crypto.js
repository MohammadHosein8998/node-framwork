import crypto from 'crypto';
import { getEnv, log } from './utils.js';

class Crypto{
    #secretKey = '';
    constructor(){
        
        this.secretKey = getEnv('SECRET_KEY');
        
    }

    toBase64(str){
        try{
            return Buffer.from(str.toString()).toString('base64url');
        }catch(e){
            return '';
        }
    }
    fromBase64(str){
        try{
            return Buffer.from(str.toString(), 'base64url').toString('utf8');
        }catch(e){
            return '';
        }
    }
    hash(str){
        try{
            return crypto.createHmac('sha256' , this.#secretKey).update(str.toString()).digest('hex');
        }catch(e){
            return '';
        }
    }

    encryption(key, data){
        try{
           const hashKeys = this.hash(key);
           const key2 = hashKeys.substring(0 , 32);
           const iv = hashKeys.slice(32 ,-16);
           let data2 = {
                'a' : Math.random(),
                'message' : data,
                'z' : Math.random()
           };
           const datafinall = JSON.stringify(data2);
           const cipher = crypto.createCipheriv('aes-256-cbc',Buffer.from(key2),iv);
           let encrypted = cipher.update(datafinall, 'utf8', 'base64');
           encrypted += cipher.final('base64');
           return this.toBase64(encrypted);
        }catch(e){
            log(e.toString());
            return '';
        }
    }
    decryption(key, data){
        try{
            const hashKeys = this.hash(key);
            const key2 = hashKeys.substring(0 , 32);
            const iv = hashKeys.slice(32 , -16);
            let data1 = this.fromBase64(data);
            const decipher = crypto.createDecipheriv('aes-256-cbc',Buffer.from(key2),iv);
            let decrypted = decipher.update(data1, 'base64','utf8');
            decrypted += decipher.final('utf8');
            const finaldata = JSON.parse(decrypted);
            return finaldata?.message ?? '';
           
        }catch(e){
            log(e.toString())
            return '';
        }
    }
}

export default new Crypto();