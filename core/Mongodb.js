// import mongoose from "mongoose";
// import {log, getEnv} from './utils.mjs';

// class MongoDB{
//     #db = null;

//     get db(){
//         return this.#db;
//     }

//     async connect(URI){
//         try{
//             this.#db = await mongoose.createConnection(URI).asPromise();
//             return true;
//         }catch(e){
//             log(`ERROR in MongoDB : ${e.toString()}`)
//             return false;
//         }
//     }
// }

// export default MongoDB;



import mongoose from 'mongoose';
import {log} from './utils.js';

class MongoDB
{
    #db = null;

    get db()
    {
        return this.#db;
    }

    async connect(URI){
        try{
            this.#db =  await mongoose.createConnection(URI).asPromise();
            log('heeloo ')
            const r = this.#db.readyState;
            return (r == 1) ? true : false;
        }
        catch(e){
            log(`MongoDB Error : ${e.toString()}`);
            return false;
        }
    }

}


export default MongoDB;