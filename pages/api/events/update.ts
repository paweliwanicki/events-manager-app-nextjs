import type { NextApiRequest, NextApiResponse } from 'next';
import { updateEvent } from '@/lib/events';
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
  if (req.method !== 'PATCH') {
    return;
  }
  const data = req.body;
  const { id, name, description, location, date, isPrivate } = data;

  if (!id || !name || !description || !location || !date) {
    res.status(422).json({
      message: 'Invalid inputs!',
    });
    return;
  }
  const session = await getServerSession(req, res, authOptions);

  await updateEvent({
    id,
    name,
    description,
    date,
    location: JSON.stringify(location),
    isPrivate: Number(isPrivate),
    updatedBy: Number(session?.user?.sub),
  });

  res.status(201).json({ message: 'Event updated successfully!' });
}
