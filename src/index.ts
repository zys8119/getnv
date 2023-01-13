import {execSync} from "child_process"
import {resolve} from "path"
import {rmSync, mkdirsSync, writeFileSync, existsSync} from "fs-extra"

export default (command:string)=>{
    const tmpDir = resolve(__dirname, '../tmp')
    const packageJsonPath = resolve(tmpDir, 'package.json')
    rmSync(tmpDir, {recursive:true, force:true})
    mkdirsSync(tmpDir)
    if(!existsSync(resolve(tmpDir, 'package.json'))){
        execSync('npm init -f', {cwd:tmpDir})
    }
    writeFileSync(packageJsonPath, JSON.stringify({
        ...require(packageJsonPath),
        version:"0.0.0"
    }, null, 4))
    execSync(`npm version `, {cwd: tmpDir})

    return require(packageJsonPath).version
}
