import http from "http";
import {
    route,
    register
} from "./core/router";
import Cookies from "cookies";

const keys = [ process.env.SECRET ];

register("/api/login", (req, res) => {
    if (req.method === "POST") {
        let body = [];
        req
            .on("data", (chunk) => body.push(chunk))
            .on("end", () => {
                body = Buffer.concat(body).toString();
                const reqBody = JSON.parse(body);
            });
    }
});


export const server = http.createServer((req, res) => {
    console.log(req.method);
    const handler = route(req),
        cookies = new Cookies(req, res, {
            keys
        });
    handler.process(req, res);
});


server.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));
server.on("error", (error) => console.error);