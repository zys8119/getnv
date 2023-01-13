import {execSync} from "child_process"

export default (command:string)=>{
    try {
        execSync(command, {
            cwd:process.cwd()
        }).toString()
    }catch (e){}
    return require('../package.json').version
}
