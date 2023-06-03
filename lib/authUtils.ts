import { PrismaClient, User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { NewUserType } from "./dbModels";
import * as jose from "jose";
import jwt from "jsonwebtoken";

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
let prisma;

if (!prisma) {
  prisma = new PrismaClient();
}

export async function fetchUserByEmail(email: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
}

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await compare(plainTextPassword, hashedPassword);
  return isValid;
}

export async function saveNewUser(user: NewUserType): Promise<User> {
  const newUser = await prisma.user.create({
    data: {
      ...user,
    },
  });

  return newUser;
}

export async function generateJWT(email: string): Promise<string> {
  const token = await new jose.SignJWT({ email })
    .setProtectedHeader({ alg })
    .setExpirationTime("24h")
    .sign(secret);

  return token;
}

export function decodeToken(token: string): {
  payload: string | jwt.JwtPayload;
  error: any;
} {
  try {
    const payload = jwt.decode(token) as jwt.JwtPayload;

    return { payload: payload, error: null };
  } catch (error) {
    return { payload: null, error };
  }
}
