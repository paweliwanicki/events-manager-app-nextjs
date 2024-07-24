import { EventDto } from '@/dtos/EventDto';
import { db } from './database';
import { EventNavigationTab } from '@/enums/EventNavigationTab';
import { Event } from '@/models/Event';

function getWhereClauseForEventsTab(tab: EventNavigationTab) {
  const whereClauses = {
    [EventNavigationTab.MY]: ' events.created_by = ? ',
    [EventNavigationTab.PUBLIC]: ' events.is_private = 0 ',
    [EventNavigationTab.PRIVATE]: ' events.is_private = 1 ',
    [EventNavigationTab.PARTICIPATION]: ' participationId > 0 ',
  };
  return whereClauses[tab];
}

export async function createEvent(newEvent: EventDto) {
  const stmt = db.prepare(`
      INSERT INTO events (name, description, location, date, is_private, created_by)
      VALUES (?, ?, ?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(
    newEvent.name,
    newEvent.description,
    newEvent.location,
    newEvent.date,
    newEvent.isPrivate,
    newEvent.createdBy
  );
}

export async function updateEvent(updEvent: EventDto) {
  const stmt = db.prepare(`
      UPDATE events 
        SET name = ?, description = ?, location = ?, date = ?, is_private = ?, updated_by = ?
      WHERE events.id = ?
      `);

  return stmt.run(
    updEvent.name,
    updEvent.description,
    updEvent.location,
    updEvent.date,
    updEvent.isPrivate,
    updEvent.updatedBy,
    updEvent.id
  );
}

export async function removeEvent(id: number) {
  const stmt = db.prepare(`
      DELETE FROM events 
      WHERE events.id = ?`);
  return stmt.run(id);
}

export async function getEvent(id: number) {
  const stmt = db.prepare(`
        SELECT * 
        FROM events 
        WHERE events.id = ?
    `);
  return stmt.get(id);
}

export async function getEvents(
  tab: EventNavigationTab,
  userId: number,
  maxNumber?: number
) {
  const params = [userId];
  let whereClause = getWhereClauseForEventsTab(tab);
  let limitClause = '';

  if (tab === EventNavigationTab.MY) {
    params.push(userId);
  }

  if (maxNumber) {
    limitClause = 'LIMIT ?';
    params.push(maxNumber);
  }

  const stmt = db.prepare(`
    SELECT events.id, 
    events.name, 
    events.date, 
    events.description,
    events.location, 
    events.is_private, 
    (users.first_name || ' ' || users.last_name) as organizator,
      (SELECT ep.id FROM events_participation ep WHERE ep.user_id = ? AND ep.event_id = events.id) as participationId
      FROM events
      INNER JOIN users ON events.created_by = users.id
      LEFT JOIN events_participation ON events.id = events_participation.event_id
      WHERE ${whereClause}
      GROUP BY events.id
      ORDER BY events.created_by DESC
    ${limitClause}`);

  return stmt.all(params) as Event[];
}
