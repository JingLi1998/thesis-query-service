import dotenv from "dotenv";
import { Request } from "express";
import passport from "passport";
import passportJWT from "passport-jwt";

const jwtStrategy = passportJWT.Strategy;

dotenv.config();

const cookieExtractor = (req: Request) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies["jwt"];
  }
  return jwt;
};

passport.use(
  "jwt",
  new jwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const { expiration } = jwtPayload;

        if (Date.now() > expiration) {
          done({ status: 401, message: "Unauthorised" }, false);
        }

        done(null, jwtPayload);
      } catch (error) {
        return done(error);
      }
    }
  )
);
