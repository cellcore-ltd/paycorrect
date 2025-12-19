import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import userRouter from "./routes/user_route.js";
import institutionRouter from "./routes/institution_route.js";
import uniqueRouter from "./routes/unique_route.js";
import errorHandler from "./middlewares/error_middleware.js";

const app = express();

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
}))

//Express Json configuration
app.use(express.json());

//Body parser configuration
app.use(bodyParser.urlencoded({ extended : true}));

//Cookie parser configuration
app.use(cookieParser());

//Passport configuration
app.use(passport.initialize());

//APi for all user requests
app.use("/users", passport.authenticate('jwt', {session : false}), userRouter);

//API for all institution requests
app.use("/institutions", passport.authenticate('jwt', {session : false}), institutionRouter);

//API for all unique request like login, logout, refresh
app.use("", uniqueRouter);

//error Handler Middleware
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});