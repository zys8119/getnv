import {execSync} from "child_process"
import {resolve} from "path"
import {rmSync, mkdirsSync, writeFileSync, existsSync, readFileSync} from "fs-extra"
import {merge} from "lodash"
export const Commands = ["major",  "minor",  "patch",  "premajor",  "preminor",  "prepatch",  "prerelease",  "fromGit"] as const
export type CommandsType = typeof Commands[number] | string
export interface Options {
    // 自定义初始版本
    version?:string
    // 是否移除临时目录
    rm?:boolean
    // 临时目录存放位置
    cwd?:string
    // 是否保存本地相对路径
    save?:boolean
    packageJsonName?:string
}
export interface GetNVType  {
    (options?:Options): {
        [key in CommandsType]:()=>string
    }
}
const defaultOpts:Options = {
    rm:true,
    packageJsonName:'package.json'
}
const GetNV:GetNVType = (opts)=>{
    const options = merge(defaultOpts, opts)
    const packageJsonName = options?.packageJsonName
    const tmpDir = resolve(options?.cwd || resolve(__dirname, '../'),'tmp')
    const packageJsonPath = resolve(tmpDir, packageJsonName)
    if(options?.rm){
        rmSync(tmpDir, {recursive:true, force:true})
    }
    mkdirsSync(tmpDir)
    if(!existsSync(resolve(tmpDir, packageJsonName))){
        execSync('npm init -y', {cwd: tmpDir})
    }
    let packageJson = JSON.parse(readFileSync(packageJsonPath).toString())
    let versionCalc = (packageJson.versionCalc || 0)+1
    const savePath = resolve(process.cwd(), packageJsonName)
    if(options?.save === true && existsSync(savePath)){
        packageJson = JSON.parse(readFileSync(savePath).toString())
        versionCalc = 2
    }
    writeFileSync(packageJsonPath, JSON.stringify({
        ...packageJson,
        versionCalc:versionCalc,
        version:typeof opts?.version === "string" ? opts?.version : (versionCalc === 1 ? '0.0.0' : packageJson.version)
    }, null, 4))
    return Commands.reduce((a,b)=>{
        const keyName = b.replace(/([A-Z])/g, (a)=>{
            return '-'+a.toLowerCase()
        })
        a[b] = ()=>{
            execSync(`npm version ${keyName}`, {cwd: tmpDir})
            const version = JSON.parse(readFileSync(packageJsonPath).toString()).version
            if(options?.rm){
                rmSync(tmpDir, {recursive:true, force:true})
            }
            if(options?.save === true && existsSync(savePath)){
                writeFileSync(savePath, JSON.stringify({
                    ...JSON.parse(readFileSync(savePath).toString()),
                    version
                }, null, 4))
            }
            return version
        }
        return a
    }, {})
}
export default GetNV
