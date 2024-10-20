
import { MongoDB } from '../global.js';
import UserSchema from '../schemas/users.js';
import { log } from '../core/utils.js';
import DateTime from '../core/DateTime.js';

class Usermodel{

    constructor(){
        this.model = MongoDB.db.model('user', UserSchema);
    }

    async register(email , password){
        try{
            const data = {
                "email" : email,
                "password" : password,
                "register_date_time" : DateTime.toString()
            }
            const row = new this.model(data)
            const result = await row.save();
            log(result);
            log(result?._id+'');
            log('mongo register');
        }catch(e){
            log(`Usermodel ERROR : ${e.toString()}`);
        }
    }
}

export default Usermodel;
