import { NextApiRequest, NextApiResponse } from "next";
import {
  fetchUserByEmail,
  generateJWT,
  hashPassword,
  saveNewUser,
} from "../../../lib/authUtils";
import validator from "validator";
import { NewUserType, UserInformationType } from "../../../lib/dbModels";
import { setCookie } from "cookies-next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { first_name, last_name, city, phone, email, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(first_name, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is Invalid",
      },
      {
        valid: validator.isLength(last_name, {
          min: 1,
          max: 20,
        }),
        errorMessage: "Last name is invalid",
      },
      {
        valid: validator.isLength(city, {
          min: 1,
          max: 20,
        }),
        errorMessage: "City is invalid",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone number is invalid",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is invalid",
      },
      {
        valid: validator.isStrongPassword(password),
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

    if (existingUser) {
      res
        .status(401)
        .json({ errorMessage: "Account already exists for that email." });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser: NewUserType = {
      first_name,
      last_name,
      email,
      phone,
      city,
      password: hashedPassword,
    };

    const savedUser = await saveNewUser(newUser);

    const jwtToken = await generateJWT(savedUser.email)

    setCookie("jwt", jwtToken, { req, res, maxAge: 60 * 6 * 24})

    const userInfo: UserInformationType = {
      id: savedUser.id,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      email: savedUser.email,
      phone: savedUser.phone,
      city: savedUser.city
    }

    res.status(200).json(userInfo);
    return;
  }
  res.status(403);
}
