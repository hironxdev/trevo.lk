import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signInSchema } from "@/lib/validations/auth.schema"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Allow accounts to be linked
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validated = signInSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email: validated.email },
            include: {
              partner: {
                select: {
                  id: true,
                  kycStatus: true,
                  partnerType: true,
                },
              },
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(validated.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            kycStatus: user.partner?.kycStatus,
            partnerType: user.partner?.partnerType,
            partnerId: user.partner?.id,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.kycStatus = user.kycStatus
        token.partnerType = user.partnerType
        token.partnerId = user.partnerId
      }

      // For Google sign-in, fetch user data from database
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          include: {
            partner: {
              select: {
                id: true,
                kycStatus: true,
                partnerType: true,
              },
            },
          },
        })

        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.kycStatus = dbUser.partner?.kycStatus
          token.partnerType = dbUser.partner?.partnerType
          token.partnerId = dbUser.partner?.id
        }
      }

      // This ensures role changes (like becoming a partner) are immediately reflected
      if (trigger === "update") {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: {
            partner: {
              select: {
                id: true,
                kycStatus: true,
                partnerType: true,
              },
            },
          },
        })

        if (freshUser) {
          token.role = freshUser.role
          token.kycStatus = freshUser.partner?.kycStatus
          token.partnerType = freshUser.partner?.partnerType
          token.partnerId = freshUser.partner?.id
          token.name = freshUser.name
          token.email = freshUser.email
          token.picture = freshUser.image
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
        session.user.kycStatus = token.kycStatus
        session.user.partnerType = token.partnerType
        session.user.partnerId = token.partnerId
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Google sign-in handling
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          // User doesn't exist, create new one
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || "Google User",
                image: user.image || profile?.image,
                role: "USER",
                emailVerified: new Date(), // Google emails are verified
              },
            })
          } else {
            // User exists, optionally update their info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            })
          }

          return true
        } catch (error) {
          console.error("Error during Google sign-in:", error)
          return false
        }
      }

      // Allow credentials sign-in
      return true
    },
  },
}
