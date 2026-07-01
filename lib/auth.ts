import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Nodemailer from "next-auth/providers/nodemailer"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    // OAuth providers will be added here soon
  ],

  callbacks:{
    session: async ({ session, user }: any) => {
      if (session.user) {
        session.user.id = user.id
        const muser = prisma.user.findUnique({
          where: { id: user.id },
          select: {
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        })
        session.user.name = (await muser)?.name || null
        session.user.email = (await muser)?.email || null
        session.user.image = (await muser)?.image || null
        session.user.phone = (await muser)?.phone || null
      }
      return session
    },
  }
})