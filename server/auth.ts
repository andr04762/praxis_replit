import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Request, Response, NextFunction } from "express";
import { db } from "./db";

(async () => {
  const email = 'andr0476@outlook.com';
  const prisma = (global as any).prisma as import('@prisma/client').PrismaClient;
  const haveUser = await prisma.user.findUnique({ where: { email } });
  if (!haveUser) {
    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        hashedPassword: await bcrypt.hash('Ra52w102$', 10),
      },
    });
    console.log('[BOOT] Demo user inserted');
  } else {
    console.log('[BOOT] Demo user already present');
  }
})();

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const user = await db.user.findUnique({
          where: { email: cleanEmail },
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
