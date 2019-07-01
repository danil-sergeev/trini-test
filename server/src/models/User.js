import {Schema, model} from "mongoose";
import {missingArgument} from "../core/utils";
import crypto from "crypto";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        unique: true,
        required: true
    }
});

userSchema.pre("save", function (next) {
    const user = this;
    if (user.isModified("passwordHash")) {
        user.passwordHash = crypto.createHash("md5").update(user.passwordHash).digest("hex");
    }
    next();
});

userSchema.methods.validatePassword = function (password = missingArgument("password")) {
    const _hash = crypto.createHash("md5").update(password).digest("hex");
    return _hash === this.passwordHash;
};


export default model("User", userSchema);
