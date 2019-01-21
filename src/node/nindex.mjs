import "babel-polyfill";
import { wrap } from "./api";

import {ToBase32} from "../core/operations/index";


export default (async () => {
    const toBase32 = await wrap(ToBase32);

    return {
        toBase32,
    };
})();
