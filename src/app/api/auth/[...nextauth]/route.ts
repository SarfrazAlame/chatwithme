import { AuthOptions, NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from "@/libs/prismaDb"
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import NextAuth from 'next-auth/next'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: 'email', type: "text" },
                password: { label: 'password', type: 'text' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Invalid Credentials')
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.email,
                    user.hashedPassword
                )

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials')
                }

                return user
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }