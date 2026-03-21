import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        console.log("Login Attempt:", { email: user?.email, provider: account?.provider, login: profile?.login });
        
        // 1. Check Emails Allowlist
        const allowedEmails = (process.env.ADMIN_EMAILS || "")
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean);

        // 2. Check GitHub Users Allowlist
        const allowedGithubUsers = (process.env.ADMIN_GITHUB_USERS || "")
          .split(",")
          .map((username) => username.trim().toLowerCase())
          .filter(Boolean);

        // ALWAYS allow this specific username as a fallback if .env is misconfigured
        if (account?.provider === "github" && profile?.login) {
          const gitHubUser = (profile.login as string).toLowerCase();
          if (allowedGithubUsers.includes(gitHubUser) || gitHubUser === "abinvarghexe") {
            console.log("GitHub User Authorized:", gitHubUser);
            return true;
          }
        }

        // Email check
        if (user?.email && allowedEmails.includes(user.email.toLowerCase())) {     
          console.log("Email Authorized:", user.email);
          return true;
        }

        console.warn("Access Denied for user:", user?.email, "github_login:", profile?.login);
        return "/admin/login?error=AccessDenied";
      } catch (error) {
        console.error("SignIn Callback Error:", error);
        return false;
      }
    },
    async jwt({ token, user, account, profile }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Override the token picture and name with the active provider's data
      if (account && profile) {
        if (account.provider === "github") {
          token.picture = profile.avatar_url;
          token.displayEmail = profile.login || profile.email;
        } else if (account.provider === "google") {
          token.picture = profile.picture;
          token.displayEmail = profile.email;
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        // Ensure the session gets the dynamically updated picture & username override
        session.user.image = token.picture || session.user.image;
        if (token.displayEmail) {
           (session.user as any).customEmailDisplay = token.displayEmail;
        }
      }
      return session;
    },
  },
};

