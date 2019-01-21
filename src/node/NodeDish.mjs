/**
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import util from "util";
import Dish from "../core/Dish";

/**
 * NodeDish
 *
 * A subclass of Dish which behaves as expected when logging out to console.
 * Also allows buffers from node's `fs` library.
 */
class NodeDish extends Dish {

    /**
    * Create a Dish
    * @param {any} dishOrInput - The dish input
    * @param {String|Number} - The dish type, as enum or string
    */
    constructor(dishOrInput=null, type=null) {

        // Allow `fs` file input:
        // Any node fs Buffers transformed to array buffer
        // NOT Buffer.buff, as this makes a buffer of the whole object.
        if (Buffer.isBuffer(dishOrInput)) {
            dishOrInput = new Uint8Array(dishOrInput).buffer;
        }

        super(dishOrInput, type);
    }

    /**
     * util.inspect.custom
     *
     * Explicitly define what we want to show when using
     * `console.log` in node > 6.
     */
    [util.inspect.custom](depth, options) {
        return this.get(Dish.typeEnum("string"));
    }

    /**
     * toString
     *
     * Avoid coercion to a String primitive on log.
     */
    toString() {
        return this.get(Dish.typeEnum("string"));
    }

    /**
     * inspect
     *
     * Backwards compatibility for node v6
     * Log only the value to the console.
     */
    inspect() {
        return this.get(Dish.typeEnum("string"));
    }

    /**
     * valueOf
     *
     * Avoid coercion to a Number primitive on log.
     */
    valueOf() {
        return this.get(Dish.typeEnum("number"));
    }
}

export default NodeDish;
