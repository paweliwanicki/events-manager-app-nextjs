import { createUser, getUser } from "@/lib/users";
import { hashPasword } from "../../../lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

const EMAIL_REGEX = new RegExp(
  "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,10}$",
  "i"
);
const PASSWORD_REGEX = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$"
);

type Data = {
  message: string;
  data?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return;
  }
  const data = req.body;
  const {
    firstName,
    lastName,
    email,
    dateOfBirth,
    password,
    confirmPassword,
  } = data;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !EMAIL_REGEX.test(email) ||
    !password ||
    !PASSWORD_REGEX.test(password) ||
    password !== confirmPassword
  ) {
    res.status(422).json({
      message: "Invalid inputs! Check the fields requirements!",
    });
    return;
  }
  const existingUser = await getUser(email);

  if (existingUser) {
    res.status(422).json({
      message: "User with this e-mail is already exists!",
    });
    return;
  }

  const hashedPassword = await hashPasword(password);

 await createUser({
    firstName,
    lastName,
    email,
    dateOfBirth,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User created!" });
}
