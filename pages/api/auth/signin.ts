import { NextApiRequest, NextApiResponse } from "next";
import {
  fetchUserByEmail,
  generateJWT,
  verifyPassword,
} from "../../../lib/authUtils";
import { UserInformationType } from "../../../lib/dbModels";
import validator from "validator";
import {setCookie} from "cookies-next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isLength(password, {
          min: 1,
        }),
        errorMessage: "Password is invalid",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length) {
      res.status(401).json({ errorMessage: errors[0] });
      return;
    }

    const existingUser = await fetchUserByEmail(email);

    if (!existingUser) {
      res
        .status(401)
        .json({ errorMessage: "Email or password is invalid." });
      return;
    }

    const passwordsMatch = await verifyPassword(
      password,
      existingUser.password
    );

    if (!passwordsMatch) {
      res.status(401).json({ errorMessage: "Email or password is invalid." });
      return;
    }

    const jwtToken = await generateJWT(existingUser.email);

    setCookie("jwt", jwtToken, { req, res, maxAge: 60 * 6 * 24})

    const userInfo: UserInformationType = {
      id: existingUser.id,
      email: existingUser.email,
      first_name: existingUser.first_name,
      last_name: existingUser.last_name,
      city: existingUser.city,
      phone: existingUser.phone
    }

    res.status(200).json(userInfo);
    return;
  }
  res.status(403);
}
