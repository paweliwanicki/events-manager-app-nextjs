import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import { getUser } from "@/lib/users";
import { Session } from "next-auth";
import { User } from "@/models/User";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      session: { strategy: "jwt" },
      maxAge: 60 * 60 * 24 * 30,
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials ?? {};
        if (!email || !password) {
          throw new Error("Wrong credentials!");
        }

        const existingUser = await getUser(email);
        if (!existingUser) {
          throw new Error("User not found!");
        }
        const isValid = await verifyPassword(
          password,
          existingUser.password ?? ""
        );

        if (!isValid) {
          throw new Error("Wrong credentials!");
        }
        return existingUser;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: {
        sub: string;
      } & Partial<User>;
      user: User;
    }) {
      if (user) {
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.admin = user.admin;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: {
        sub: string;
      } & Partial<User>;
    }) {
      const { sub, email, admin, first_name, last_name } = token;
      const user = {
        sub,
        email,
        admin,
        first_name,
        last_name,
      };

      session.user = user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
