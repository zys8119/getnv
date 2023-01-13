import {execSync} from "child_process"

console.log(execSync('npm version prerelease', {
    cwd:process.cwd()
}).toString())
