import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import db from "./db.js";
import env from "dotenv";

//configurations for checking token using passport
env.config();

const opt = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.ACCESS_TOKEN_SECRET
}

//JWT authentication using passport js
passport.use("jwt",
    //Creating a new strategy for authenticating JWT
    new Strategy(opt, async (jwt_payload, cb) => {
        try{
            const data = await db.query("SELECT * FROM admins");
            const users = data.rows;

            const user = users.find(u => u.id === jwt_payload.id);
            delete user['password'];
            return cb(null, user);
        } catch (err) {
            return cb(err, false);
        };
}));

export default passport;