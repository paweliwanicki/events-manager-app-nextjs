import { EventParticipation } from '@/models/EventParfticipation';
import { db } from './database';

export async function joinEvent(eventId: number, userId: number) {
  const stmt = db.prepare(`
      INSERT INTO events_participation (event_id, user_id)
      VALUES (?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(eventId, userId);
}

export async function leaveEvent(participationId: number) {
  const stmt = db.prepare(`
      DELETE FROM events_participation 
      WHERE id = ?`);
  return stmt.run(participationId);
}

export async function getEventParticipation(participationId: number) {
  const stmt = db.prepare(`
      SELECT * from events_participation ep WHERE ep.id = ? 
    `);

  return stmt.get(participationId) as EventParticipation;
}
