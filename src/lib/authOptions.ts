import { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

declare module "next-auth" {
    interface User {
        id: string;
        username: string;
        name: string;
        regno: number;
        isAdmin: boolean;
        isMember: boolean;
        isBanned: boolean;
    }
    interface Session {
        user: User & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        regno: true,
                        password: true,
                        isAdmin: true,
                        isMember: true,
                        isBanned: true
                    }
                });

                if (!user) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                
                if (isPasswordValid) {
                    return {
                        id: user.id,
                        username: user.username ?? '',
                        name: user.name ?? '',
                        regno: user.regno ?? '',
                        isAdmin: user.isAdmin,
                        isBanned: user.isBanned,
                        isMember: user.isMember
                    };
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.regno = user.regno;
                token.isAdmin = user.isAdmin;
                token.isBanned = user.isBanned;
                token.isMember = user.isMember;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.regno = token.regno as number;
                session.user.isAdmin = token.isAdmin as boolean;
                session.user.isBanned = token.isBanned as boolean;
                session.user.isMember = token.isMember as boolean;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
