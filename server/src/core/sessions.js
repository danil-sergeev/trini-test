import Cookies from "cookies";
import {missingArgument} from "./utils";

let sessions = Object.create(null);

const deactivateSessions = () => sessions = Object.create(null);
const deleteSession = (sid = missingArgument('sid')) => delete sessions[sid];

function newSession(req = missingArgument("req"), res = missingArgument("res"), userId = missingArgument("userId")) {
    const cookies = new Cookies(req, res, {keys: [process.env.SECRET]});
    sessions[userId] = true;
    cookies.set("sid", userId, { signed: true });
}

function isSession(req = missingArgument("req"), res = missingArgument("res")) {
    const cookies = new Cookies(req, res, {keys: [process.env.SECRET]});
    const sid = cookies.get("sid", { signed: true });
    return !!sessions[sid]
}

function getSid(req = missingArgument("req"), res = missingArgument("res")) {
    const cookies = new Cookies(req, res, {keys: [process.env.SECRET]});
    return cookies.get("sid", { signed: true });
}

export {
    newSession,
    isSession,
    getSid,
    deleteSession
}