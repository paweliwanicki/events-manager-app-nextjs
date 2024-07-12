import { createUser, getUser } from '@/lib/users';
import { hashPasword } from '../../../lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

const EMAIL_REGEX = new RegExp(
  '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,10}$',
  'i'
);
const PASSWORD_REGEX = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$'
);

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return;
  }
  const data = req.body;
  const {
    first_name,
    last_name,
    email,
    date_of_birth,
    password,
    confirmPassword,
  } = data;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !EMAIL_REGEX.test(email) ||
    !password ||
    !PASSWORD_REGEX.test(password) ||
    password !== confirmPassword
  ) {
    res.status(422).json({
      message: 'Invalid inputs! Check the fields requirements!',
    });
    return;
  }
  const existingUser = await getUser(email);

  if (existingUser) {
    res.status(422).json({
      message: 'User with this e-mail is already exists!',
    });
    return;
  }

  const hashedPassword = await hashPasword(password);

  const results = await createUser({
    first_name,
    last_name,
    email,
    date_of_birth,
    password: hashedPassword,
  });
  console.log(results);

  res.status(201).json({ message: 'User created!' });
}
