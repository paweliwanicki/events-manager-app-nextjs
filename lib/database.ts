import sql from 'better-sqlite3';

export const db = new sql('events_manager.db');

export function initDb() {
  console.log('init');
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY, 
      first_name TEXT NOT NULL, 
      last_name TEXT NOT NULL,
      date_of_birth INTEGER NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
      modified_at INTEGER
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
      is_private BOOLEAN, 
      user_id INTEGER, 
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS events_participation (
      id INTEGER PRIMARY KEY, 
      user_id INTEGER NOT NULL, 
      event_id INTEGER NOT NULL, 
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
      modified_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
      FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE
    )`);

  db.exec(`
      CREATE TABLE IF NOT EXISTS friendships (
        id INTEGER PRIMARY KEY, 
        user_id INTEGER, 
        friend_id INTEGER, 
        is_accepted BOOLEAN DEFAULT false,
        created_at INTEGER DEFAULT CURRENT_TIMESTAMP,
        modified_at INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
        FOREIGN KEY(friend_id) REFERENCES events(id) ON DELETE CASCADE
      )`);
}

initDb();
