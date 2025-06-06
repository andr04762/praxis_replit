import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/db/client";
import { getUserByEmail } from "../../../lib/db/user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;
        const user = await getUserByEmail(creds.email);
        if (!user?.hashedPassword) return null;
        const ok = await bcrypt.compare(creds.password, user.hashedPassword);
        return ok ? user : null;
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
