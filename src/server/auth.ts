import NextAuth, { AuthOptions, DefaultUser, getServerSession } from 'next-auth'
import { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/server/db';
import { Adapter } from 'next-auth/adapters';

declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: User;
  }

  export interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
        role: token.role,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "sujatha" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await db.user.findFirst({
          where: {
            username: credentials!.username
          }
        })
        if (user && user.password === credentials?.password) {
          return {
            id: user.username,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/'
  }
}

export const getServerAuthSession = () => getServerSession(authOptions)