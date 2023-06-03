import { NextApiRequest, NextApiResponse } from "next";
import { fetchUserByEmail, decodeToken } from "../../../lib/authUtils";
import { UserInformationType } from "../../../lib/dbModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bearerToken = req.headers["authorization"] as string;
  const token = bearerToken.split(" ")[1];

  const returnedObj = (await decodeToken(token)) as {
    payload: { email: string };
    error: any;
  };

  if (!returnedObj.payload || !returnedObj.payload.email || returnedObj.error) {
    res.status(401).json({ errorMessage: "Unauthorized request" });
    return;
  }

  const existingUser = await fetchUserByEmail(returnedObj.payload.email);

  if (!existingUser) {
    res.status(401).json({ errorMessage: "Unauthorized request" });
    return;
  }

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
