import { db } from "./database";


export async function createEvent(user: NewEventDto) {
  const stmt = db.prepare(`
      INSERT INTO users (first_name, last_name, email, date_of_birth, password)
      VALUES (?, ?, ?, ?, ?)`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.run(
    user.first_name,
    user.last_name,
    user.email,
    user.date_of_birth,
    user.password
  );
}


export async function getEvents(maxNumber: number) {
  let limitClause = "";

  if (maxNumber) {
    limitClause = "LIMIT ?";
  }

  const stmt = db.prepare(`
    SELECT events.id, events.name, events.date, events.description, events.location, events.is_private,
    EXISTS(SELECT ep.id FROM events_participation ep WHERE ep.user_id = ? AND ep.event_id = events.id) as participationId
    FROM events
    INNER JOIN users ON events.created_at = users.id
    LEFT JOIN events_participation ON events.id = events_participation.event_id
    GROUP BY events.id
    ORDER BY events.created_at DESC
    ${limitClause}`);

  //await new Promise((resolve) => setTimeout(resolve, 1000));
  return maxNumber ? stmt.all(maxNumber) : stmt.all();
}
