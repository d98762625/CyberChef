/**
 * This script generates the exports functionality for the node API.
 *
 * it exports chef as default, but all the wrapped operations as
 * other top level exports.
 *
 * @author d98762656 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/*eslint no-console: 0 */

import fs from "fs";
import path from "path";
import * as operations from "../../../core/operations/index";
import { decapitalise } from "../../apiUtils";
import excludedOperations from "../excludedOperations";

const includedOperations = Object.keys(operations).filter((op => excludedOperations.indexOf(op) === -1));

const dir = path.join(`${process.cwd()}/src/node`);
if (!fs.existsSync(dir)) {
    console.log("\nCWD: " + process.cwd());
    console.log("Error: generateNodeIndex.mjs should be run from the project root");
    console.log("Example> node --experimental-modules src/core/config/scripts/generateNodeIndex.mjs");
    process.exit(1);
}

let code = `/**
* THIS FILE IS AUTOMATICALLY GENERATED BY src/node/config/scripts/generateNodeIndex.mjs
*
* @author d98762625 [d98762625@gmail.com]
* @copyright Crown Copyright ${new Date().getUTCFullYear()}
* @license Apache-2.0
*/

/* eslint camelcase: 0 */


import "babel-polyfill";
import NodeDish from "./NodeDish";
import { wrap, help, bake, explainExludedFunction } from "./api";
import {
    // import as core_ to avoid name clashes after wrap.
`;

includedOperations.forEach((op) => {
    // prepend with core_ to avoid name collision later.
    code += `    ${op} as core_${op},\n`;
});

code +=`
} from "../core/operations/index";

// Define global environment functions
global.ENVIRONMENT_IS_WORKER = function() {
    return typeof importScripts === "function";
};
global.ENVIRONMENT_IS_NODE = function() {
    return typeof process === "object" && typeof require === "function";
};
global.ENVIRONMENT_IS_WEB = function() {
    return typeof window === "object";
};


let chef;
let operations;
// Needs to be in function so the async wrap can resolve.
(async () => {

    /**
     * generateChef
     *
     * Creates decapitalised, wrapped ops in chef object for default export.
     */
    async function generateChef() {
        return {
`;

includedOperations.forEach((op) => {
    code += `            "${decapitalise(op)}": await wrap(core_${op}),\n`;
});

excludedOperations.forEach((op) => {
    code += `            "${decapitalise(op)}": explainExludedFunction("${op}"),\n`;
});

code += `        };
    }

    const chef = await generateChef();
    // Add some additional features to chef object.
    chef.help = help;
    chef.Dish = NodeDish;

    console.log('CHEF:');
    console.log(chef);

    const operations = {
`;

Object.keys(operations).forEach((op) => {
    code += `        ${decapitalise(op)}: chef.${decapitalise(op)},\n`;
});

code +=`
    };

    const prebaked = bake();
    chef.bake = prebaked;

    return { chef, operations };

})();

`;

Object.keys(operations).forEach((op) => {
    code += `const ${decapitalise(op)} = operations.${decapitalise(op)};\n`;
});

code += `

export default chef;

// Operations as top level exports.
const operationsArray = Object.keys(operations).map(k => operations[k]);

export {
    operationsArray as operations,
`;

Object.keys(operations).forEach((op) => {
    code += `    ${decapitalise(op)},\n`;
});

code += "    NodeDish as Dish,\n";
code += "    prebaked as bake,\n";
code += "    help,\n";
code += "};\n";


fs.writeFileSync(
    path.join(dir, "./index.mjs"),
    code
);
