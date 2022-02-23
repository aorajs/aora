import * as esbuild from 'esbuild';
import * as path from 'path';
import * as fse from 'fs-extra'
import { builtinModules as nodeBuiltins } from "module";
import { lessLoader } from 'esbuild-plugin-less';
// const sassPlugin = require("esbuild-plugin-sass")
const cssModulesPlugin = require('esbuild-css-modules-plugin');

export const loaders: { [ext: string]: esbuild.Loader } = {
    ".aac": "file",
    ".css": "file",
    ".eot": "file",
    ".flac": "file",
    ".gif": "file",
    ".ico": "file",
    ".jpeg": "file",
    ".jpg": "file",
    ".js": "jsx",
    ".jsx": "jsx",
    ".json": "json",
    // We preprocess md and mdx files using XDM and send through
    // the JSX for esbuild to handle
    ".md": "jsx",
    ".mdx": "jsx",
    ".mp3": "file",
    ".mp4": "file",
    ".ogg": "file",
    ".otf": "file",
    ".png": "file",
    ".svg": "file",
    ".ts": "ts",
    ".tsx": "tsx",
    ".ttf": "file",
    ".wav": "file",
    ".webm": "file",
    ".webp": "file",
    ".woff": "file",
    ".woff2": "file",
};

(async function () {
    // const pkg = 
    const routes = {
        'pages/posts/$id/edit': {
            'path': '',
            'id': 'pages/posts/$id/edit',
            'file': 'pages/posts/$id/edit.tsx',
        },
        'pages/posts/index': {
            'path': '',
            'index': true,
            'id': 'pages/posts/index',
            'file': 'pages/posts/index.tsx',
        },
        'pages/posts/add': {
            'path': '',
            'id': 'pages/posts/add',
            'file': 'pages/posts/add.tsx',
        },
        'pages/index': {
            'path': '',
            'index': true,
            'id': 'pages/index',
            'file': 'pages/index.tsx',
        },
    };
    const pkg = require(path.resolve(process.cwd(), './package.json'))
    const dependencies = Object.keys(pkg.dependencies)
    const externals = nodeBuiltins.filter(mod => !dependencies.includes(mod));

    //   console.log('nodeBuiltins', nodeBuiltins)
    const entryPoints: esbuild.BuildOptions['entryPoints'] = {
        // "entry.client": path.resolve(__dirname, config.entryClientFile)
    };

    for (let id of Object.keys(routes)) {
        // All route entry points are virtual modules that will be loaded by the
        // browserEntryPointsPlugin. This allows us to tree-shake server-only code
        // that we don't want to run in the browser (i.e. action & loader).
        entryPoints[id] =
            path.resolve(__dirname, '../web', routes[id].file) + '?browser';
    }
    const res = await esbuild.build({
        entryPoints,
        outdir: './public/build',
        entryNames: "[dir]/[name]-[hash]",
        metafile: true,
        external: externals,
        mainFields: ["browser", "module", "main"],
        chunkNames: "_shared/[name]-[hash]",
        bundle: true,
        platform: "browser",
        format: "esm",
        // logLevel: "silent",
        target: "es6",
        treeShaking: true,
        splitting: true,
        plugins: [
            cssModulesPlugin({ v2: true ,inject: true,}), 
            lessLoader({
                javascriptEnabled: true
            }, {
                filter: /\.less$/,
            }),
            // sassPlugin()
        ],
        assetNames: "_assets/[name]-[hash]",
        // inject: [reactShim],
        loader: loaders,
        publicPath: '/build',
    });
    const outputs = res.metafile.outputs
    const assets = {
        root: {
            shared: [
            ]
        },
        pages: {

        },
    }
    const manifest = {
        css: {},
        js: {},
        dep: {},
    }
    Object.entries(outputs).forEach(([chunk, file]) => {
        manifest.dep[chunk] = Object.keys(file.inputs).filter(k => k !== file.entryPoint)
        const ext = path.extname(chunk).slice(1)
        const filePath = chunk.slice('public'.length)
        if (ext) {
            Object.entries(file.inputs).forEach(([inputKey, inputObj]) => {
                manifest[ext][inputKey] = filePath
            })
        }
    })
    console.log(manifest)
    Object.entries(outputs).forEach(([chunk, file]) => {
        const filePath = chunk.slice('public'.length)
        if (!file.entryPoint) {
            if (chunk.endsWith('.js')) {
                // assets.root.shared.push(filePath)
            }
        } else {
            const entryPoint = file.entryPoint.slice('web/'.length).replace('.tsx?browser', '')
            assets.pages[entryPoint] = {
                css: Object.keys(file.inputs).map(i => {
                    return manifest.css[i]
                }).filter(o => o),
                // js: Object.keys(file.inputs).map(i => {
                //     return manifest.js[i]
                // }).filter(o => o),
                js: [...file.imports.map(i => {
                    if (i.path.startsWith('public/')) {
                        return i.path.slice('public'.length)
                    }
                    return i.path
                }), filePath]
            }
        }
    });

    await fse.writeFile(path.resolve(__dirname, '../public/build/assets.json'), JSON.stringify(assets))
    console.log(assets)
})();
