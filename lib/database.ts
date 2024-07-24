import sql from 'better-sqlite3';

export const db = new sql('events_manager.db');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT NOT NULL, 
      last_name TEXT NOT NULL,
      date_of_birth INTEGER NOT NULL,
      email TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT false,
      password TEXT NOT NULL,
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
      updated_at INTEGER,
      FOREIGN KEY(id) REFERENCES friendships(user_id) ON DELETE CASCADE
      FOREIGN KEY(id) REFERENCES friendships(friend_id) ON DELETE CASCADE
      FOREIGN KEY(id) REFERENCES events_participation(user_id) ON DELETE CASCADE
      FOREIGN KEY(id) REFERENCES events(created_by) ON DELETE CASCADE
      )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY, 
      name TEXT NOT NULL,
      date INTEGER NOT NULL, 
      description TEXT NOT NULL, 
      location TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      is_private BOOLEAN
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS events_participation (
      id INTEGER PRIMARY KEY, 
      user_id INTEGER NOT NULL, 
      event_id INTEGER NOT NULL, 
      created_by INTEGER DEFAULT CURRENT_TIMESTAMP,
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      updated_at INTEGER
    )`);

  db.exec(`
      CREATE TABLE IF NOT EXISTS friendships (
        id INTEGER PRIMARY KEY, 
        user_id INTEGER, 
        friend_id INTEGER, 
        is_accepted BOOLEAN DEFAULT false,
        created_at INTEGER DEFAULT CURRENT_TIMESTAMP              
      )`);
}

initDb();
