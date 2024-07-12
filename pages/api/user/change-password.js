import { connectToDb } from '../../../lib/db';
import { hashPasword, verifyPassword } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return;
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  const userEmail = session.user.email;
  const { newPassword, oldPassword } = req.body;

  try {
    const client = await connectToDb();
    const usersCollection = client.db().collection('users');

    const existingUsers = await usersCollection.findOne({ email: userEmail });
    if (!existingUsers) {
      res.status(404).json({ message: 'User not found!' });
      client.close();
      return;
    }

    const currentPassword = existingUsers.password;

    const validPasswords = await verifyPassword(oldPassword, currentPassword);

    if (!validPasswords) {
      res.status(422).json({ message: 'Old password is incorect!' });
      client.close();
      return;
    }

    const hashedNewPassword = await hashPasword(newPassword);

    usersCollection.updateOne(
      { email: userEmail },
      { $set: { password: hashedNewPassword } }
    );

    client.close();
    session.close();
    res.status(200).json({ message: 'Password updated!' });
  } catch (error) {
    console.error(error);
  }
}
