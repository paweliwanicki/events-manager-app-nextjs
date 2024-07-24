import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvent, removeEvent } from '@/lib/events';

type Data = {
  message: string;
  data?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'DELETE') {
    return;
  }
  const data = req.body;
  const { id } = data;

  if (!id) {
    res.status(422).json({
      message: 'Invalid inputs!',
    });
    return;
  }
  const event = await getEvent(id);
  if (!event) {
    res.status(404).json({ message: 'Event not found!' });
    return;
  }

  await removeEvent(id);
  res.status(200).json({ message: 'Event removed successfully!' });
}
