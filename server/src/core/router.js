import createHandler from "./handler";
import {
    readFileSync
} from "fs";
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

function route(req = missingArgument("req")) {
    const {
        pathname
    } = parse(req.url, true);
    let handler = handlers[pathname];
    if (!handler) handler = missing(req);
    return handler;
};


function missing(req = missingArgument("req")) {
    const {
        pathname
    } = parse(req.url, true);
    const path = process.cwd() + "/public" + `${pathname}.html`;
    console.info("path", path, pathname, req.url);
    try {
        if (req.method === "GET") {
            const data = readFileSync(path),
            mimeType = req.headers.accepts || "text/html";
            return createHandler((req, res) => {
                res.writeHead(200, {
                    'Content-Type': mimeType
                });
                res.write(data);
                res.end();
        });
        }
    } catch (error) {
        console.error(error);
        return createHandler((req, res) => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            res.write("No route registered for " + pathname);
            res.end();
        });
    }
}

export {
    clearHandlers,
    route,
    missing,
    register
};