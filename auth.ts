import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/utils/hash";
import { signInSchema } from "./lib/zod";
import { generateAuthJwt } from "./lib/jwt";
import verifyTwoFactor from "./lib/twoFaAuth";
import EDevlet from "./lib/edevlet";
import { db } from "@/db";
import { maskString } from "@/utils/maskString";
import dayjs from 'dayjs';

class InvalidLoginError extends CredentialsSignin { code = "Invalid Credentials" }
class TwoFactorRequired extends CredentialsSignin { code = "Two Factor Required"; }

let twoFactorStatus = false;

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    EDevlet({ clientId: process.env.AUTH_E_DEVLET_CLIENT_ID!, clientSecret: process.env.AUTH_E_DEVLET_CLIENT_SECRET! }),
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),    
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
    Credentials({
      name: "Credentials",
      credentials: { username: {}, password: {}, twoFactorCode: {} },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) throw new InvalidLoginError();
        
        const validation = signInSchema.safeParse(credentials);
        //const { username, password, twoFactorCode } = await signInSchema.parseAsync(credentials);
        if (!validation.success) throw new InvalidLoginError();

        const user = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.username, String(validation.data.username)),
          with: {
            twoFactorAuthentication: true,
            avatar: { columns: { id: true, bucketId: true, bucketRegion: true } },
            grant: true,
            nationality: true,
            userDetails: { columns: { id: true, address: true, phoneNumber: true } },
            academicInfo: {
              columns: { id:true, arrivalType: true, degree: true, semester: true, paymentStatus: true, grant: true },
              with: {
                department: { columns: { id: true, departmentName: true } },
                unit: { columns: { id: true, unitName: true } },
                instructor: {
                  columns: { id: true, name: true, surname: true },
                  with: { avatar: true }
                }
              }
            }
          }
        });

        if (!user) throw new InvalidLoginError();

        const isPasswordValid = verifyPassword(validation.data.password, user.password);

        if (!isPasswordValid) throw new InvalidLoginError();

        if (user?.twoFactorAuthentication) {
          if (!validation.data.twoFactorCode) throw new TwoFactorRequired();

          const verifyToken = verifyTwoFactor({ pinCode: validation.data.twoFactorCode, secretKey: user?.twoFactorAuthentication.secretKey });

          if (!verifyToken.success) throw new TwoFactorRequired();

          twoFactorStatus = true;
        }
         
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          fullName: user.name && user.surname ? `${user.name} ${user.surname}` : null,
          role: user.role,
          identityNumber: maskString(user.identityNumber, 3, 2),
          gender: user.gender,
          birthDay: user.birthday ? dayjs(user.birthday).format("DD/MM/YYYY") : null,
          grants: user.grant ?? null,
          twoFactor: user.twoFactorAuthentication ?? null,
          academicInfo: user.academicInfo ?? null,
          userDetails: user.userDetails ?? null,
          nationality: user.nationality ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials" && !!user?.twoFactor && !twoFactorStatus) throw new TwoFactorRequired();
  
      if (account?.provider === "google") {
        if (!user.email) throw new CredentialsSignin("Google hesabınızda e-posta adresi bulunamadı.");
        
        const googleEmail = String(user.email);
        
        const existingUser = await db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, googleEmail),
          with: {
            twoFactorAuthentication: true,
            avatar: { columns: { id: true, bucketId: true, bucketRegion: true } },
            grant: true,
            nationality: true,
            userDetails: { columns: { id: true, address: true, phoneNumber: true } },
            academicInfo: {
              columns: { id:true, arrivalType: true, degree: true, semester: true, paymentStatus: true, grant: true },
              with: {
                department: { columns: { id: true, departmentName: true } },
                unit: { columns: { id: true, unitName: true } },
                instructor: {
                  columns: { id: true, name: true, surname: true },
                  with: { avatar: true }
                }
              }
            }
          }
        });

        if (!existingUser) throw new CredentialsSignin("Google hesabınız sistemde kayıtlı değil.");
  
        Object.assign(user, {
          id: existingUser.id,
          username: existingUser.username,
          avatar: existingUser.avatar,
          fullName: existingUser.name && existingUser.surname ? `${existingUser.name} ${existingUser.surname}` : null,
          role: existingUser.role,
          identityNumber: maskString(existingUser.identityNumber, 3, 2),
          gender: existingUser.gender,
          birthDay: existingUser.birthday ? dayjs(existingUser.birthday).format("DD/MM/YYYY") : null,
          grants: user.grant ?? null,
          academicInfo: existingUser.academicInfo ?? null,
          userDetails: existingUser.userDetails ?? null,
          nationality: existingUser.nationality ?? null,
        });
      }
  
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = { ...user };
        const authToken = await generateAuthJwt({
          id: user.id,
          role: user?.role,
          bucketId: user?.avatar?.bucketId,
          bucketRegion: user?.avatar?.bucketRegion
        });
        token.authToken = authToken.toString();
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
        session.authToken = token.authToken
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/", error: "/error" },
  session: { strategy: "jwt", maxAge: 60 * 60 },
  //redirectProxyUrl: "http://auth.misy.com/api/auth"
});