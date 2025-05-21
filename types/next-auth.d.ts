import NextAuth from "next-auth";
declare module "next-auth" {
  interface Session {
    user: any;
    authToken?: any;
  }
  
  interface User extends UserBase {
    role: string;
    avatar: any;
    grant?: any;
    twoFactor?: any;
  }
}