import {missingArgument} from "./utils";
/**
 * Обработчик
 */
class Handler {
    constructor(method) {
        this.method = method;
    };

    process(req, res) {
        const params = null;
        return this.method.apply(this, [req, res, params]);
    }
};


export default (method = missingArgument("method")) => new Handler(method);