import {buildSync} from "esbuild"

buildSync({
    entryPoints:[
        'src/index.ts'
    ],
    loader:{
        '.ts':'ts'
    },
    outdir:'dist',
    platform:'node',
    // minify:true
})
