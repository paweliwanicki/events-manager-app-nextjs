import type { NextApiRequest, NextApiResponse } from 'next';
import { getEvents, updateEvent } from '@/lib/events';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { EventNavigationTab } from '@/enums/EventNavigationTab';
import { Event } from '@/models/Event';
import { User } from '@/models/User';

type Data = {
  message: string;
  events: Event[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return;
  }

  let tab = req.query.eventsTab?.[0] ?? '';
  tab = (tab.charAt(0).toUpperCase() + tab.slice(1)) as EventNavigationTab;
  const session = await getServerSession(req, res, authOptions);
  const events = await getEvents(tab, +session?.user?.sub);

  res
    .status(201)
    .json({ message: `${tab} events fetched successfully`, events });
}
