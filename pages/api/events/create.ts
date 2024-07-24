import { createUser, getUser } from '@/lib/users';
import { hashPasword } from '../../../lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createEvent } from '@/lib/events';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
  message: string;
  data?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return;
  }
  const data = req.body;
  const { name, description, location, date, isPrivate } = data;

  if (!name || !description || !location || !date) {
    res.status(422).json({
      message: 'Invalid inputs!',
    });
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  await createEvent({
    name,
    description,
    date,
    location: JSON.stringify(location),
    isPrivate: Number(isPrivate),
    createdBy: Number(session?.user?.sub),
  });

  res.status(201).json({ message: 'Event created successfully!' });
}
