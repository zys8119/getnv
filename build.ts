import {buildSync} from "esbuild"
import GetNV from "./src/index"

buildSync({
    entryPoints:[
        'src/index.ts',
    ],
    loader:{
        '.ts':'ts'
    },
    outdir:'dist',
    platform:'browser',
    format:'cjs',
    minify:true
})

// 生成自动版本号
GetNV({
    save:true
}).patch()
