import createHandler from "./handler";
import {
    parse
} from "url";
import {
    missingArgument
} from "./utils";

const handlers = Object.create(null);

function clearHandlers() {
    return handlers = Object.create(null);
};

function register(url = missingArgument("url"), method = missingArgument("method")) {
    handlers[url] = createHandler(method);
};

function route(req = missingArgument("req"), res = missingArgument("res")) {
    const {
        pathname
    } = parse(req.url, true);
    let handler = handlers[pathname];
    if (!handler) {
        res.writeHead(404, {
           'Content-Type': "text/html" 
        });
        res.write(`<p>No route registered for ${pathname}</p>`)
        res.end();
    }
    return handler;
};

export {
    clearHandlers,
    route,
    register
};