import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Request, Response, NextFunction } from "express";
import { db } from "./db";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await db.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (!user) return done(null, false, { message: "No user" });

        const match = await bcrypt.compare(password, user.hashedPassword ?? "");
        if (!match) return done(null, false, { message: "Bad pwd" });

        return done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.user.findUnique({ where: { id: String(id) } });
    done(null, user || false);
  } catch (err) {
    done(err as Error);
  }
});

export function ensureAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

export default passport;
