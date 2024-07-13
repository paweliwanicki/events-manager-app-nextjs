import { NewUserDto, User } from "@/models/User";
import { db } from "./database";

export async function createUser(user: NewUserDto) {
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

export async function updateUser(updUser: Partial<User>) {
  const stmt = db.prepare(`
    UPDATE users SET (${Object.keys(updUser).join(",")})
    VALUES (?, ?, ?, ?, ?) 
    WHERE id = ?`);

  return stmt.run(Object.values(updUser), updUser.id);
}

export async function deleteUser(userId: number) {
  const stmt = db.prepare(`
    DELETE FROM users 
    WHERE id = ?`);

  return stmt.run(userId);
}

export async function getUsers(where?: string, maxNumber?: number) {
  let limitClause = "";
  let whereClause = "";

  if (maxNumber) {
    limitClause = "LIMIT ?";
  }

  if (where) {
    whereClause = `WHERE ?`;
  }

  const stmt = db.prepare(`
    SELECT * FROM users
    ${whereClause}
    ${limitClause}`);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return stmt.all(maxNumber, where);
}

export async function getUser(email: string) {
  const stmt = db.prepare(`
    SELECT * FROM users 
    WHERE email = ?
    LIMIT 1
  `);

  return (await stmt.get(email)) as User;
}
