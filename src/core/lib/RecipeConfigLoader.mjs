/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2020
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

/**
 * RecipeConfigLoaderInstance hydrates recipeConfigs, loading required
 * modules as required and caching them.
 *
 * This class is designed to be used as a singleton.
 */
class RecipeConfigLoaderInstance {
    /**
     * RecipeConfigLoaderInstance constructor
     */
    constructor() {
        this._modules = null;
    }

    /**
     * Populate elements of opList with operation instances.
     * Return a new array containing the hydrated operations.
     *
     * @param {Array<Object>} opList
     */
    async hydrateOpList(opList) {
        if (!this._modules) {
            // Using Webpack Magic Comments to force the dynamic import to be included in the main chunk
            // https://webpack.js.org/api/module-methods/
            const modules = await import(/* webpackMode: "eager" */ "../config/modules/OpModules.mjs");
            this._modules = modules.default;
        }

        return opList.map(o => {
            if (o instanceof Operation) {
                return o;
            } else {
                const op = new this._modules[o.module][o.name]();
                op.ingValues = o.ingValues;
                op.breakpoint = o.breakpoint;
                op.disabled = o.disabled;
                return op;
            }
        });
    }
}

export default new RecipeConfigLoaderInstance();
