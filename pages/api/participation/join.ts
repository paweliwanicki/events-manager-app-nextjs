import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { joinEvent } from '@/lib/participation';
import { getEvent } from '@/lib/events';

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

  const eventId = req.query?.eventId ? +req.query?.eventId : 0;

  if (!eventId) {
    res.status(422).json({
      message: 'Missing event ID !',
    });
    return;
  }
  const event = await getEvent(eventId);

  if (!event) {
    res.status(422).json({
      message: 'Event not found!',
    });
    return;
  }

  const session = await getServerSession(req, res, authOptions);

  await joinEvent(+eventId, session?.user?.sub);

  res.status(201).json({ message: 'Event joined successfully!' });
}
