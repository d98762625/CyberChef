import json from "rollup-plugin-json";
import nodeResolve from 'rollup-plugin-node-resolve-angular';
import fs from 'fs';

import cjs from "rollup-plugin-cjs-es";



const pkg = JSON.parse(fs.readFileSync('./package.json'));
const external = Object.keys(pkg.dependencies || {});

export default [{
    input: "src/node/index.mjs",
    output: [
        {
            // file: "build/node/bundle.js",
            dir: "build/node",
            format: "esm",
            name: "cyberchef",
        }
    ],
    external: external.concat([
        "zlibjs",
    ]),
    plugins: [
        json({
            // All JSON files will be parsed by default,
            // but you can also specifically include/exclude files
            // include: 'node_modules/**',
            // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
      
            // for tree-shaking, properties will be declared as
            // variables, using either `var` or `const`
            preferConst: true, // Default: false
      
            // specify indentation for the generated default export —
            // defaults to '\t'
            // indent: '  ',
      
            // ignores indent and generates the smallest code
            // compact: true, // Default: false
      
            // generate a named export for every property of the JSON object
            // namedExports: true // Default: true
        }),

        nodeResolve({
            preferBuiltins: false,
            extensions: ['.js', '.mjs', '.min'],
        }),
        cjs({
            nested: true
        })
    ]
}];
