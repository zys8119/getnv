import {buildSync} from "esbuild"

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
