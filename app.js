import aplication from "./aplication.js";
import { log,getEnv } from "./core/utils.js";

async function main(){
    try{
        const app = new aplication();
        await app.run();
    }catch(e){
        log(`ERROR on : main ${e.toString()}`);
    }
}

main();

