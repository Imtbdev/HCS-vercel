import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { $api } from "@/lib/$auth_api";
import { ROUTE_LINKS } from "@/consts/main.consts";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: ROUTE_LINKS.auth.login,
    error: ROUTE_LINKS.auth.error,
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account }) {
      const isSignIn = !!user && !!account;
      if (isSignIn) {
        if (account?.provider === "credentials") {
          if ("jwt" in user) {
            token.jwt = user.jwt;
            token.userInfo = user;
          }
          return token;
        } else {
          const data = await $api(`auth/${account.provider}/callback`, {
            method: "GET",
            body: {
              access_token: account.access_token,
            },
          });
          if (!data.user) {
            return null;
          }

          token.jwt = data.jwt;
          token.userInfo = data.user;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.userInfo = token.userInfo;
        session.user.token = token.jwt;
      }

      // console.log(session);
      return session;
    },
  },
  ...authConfig,
});
