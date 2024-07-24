import type { NextApiRequest, NextApiResponse } from 'next';
import { getEventParticipation, leaveEvent } from '@/lib/participation';

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'DELETE') {
    return;
  }

  const id = req.query?.id ? +req.query?.id : 0;
  if (!id) {
    res.status(422).json({
      message: 'Missing event participation ID !',
    });
    return;
  }

  const participation = await getEventParticipation(id);
  if (!participation) {
    res.status(404).json({
      message: 'Event participation not found !',
    });
    return;
  }
  await leaveEvent(id);

  res.status(200).json({ message: 'Event leaved successfully!' });
}
