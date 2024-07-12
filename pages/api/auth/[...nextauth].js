import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDb } from '../../../lib/db';
import { verifyPassword } from '../../../lib/auth';

export const authOptions = {
  secret: 'jwtsecrethehe',
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const client = await connectToDb();
        const usersCollection = client.db().collection('users');
        const existingUser = await usersCollection.findOne({
          email,
        });

        if (!existingUser) {
          client.close();
          throw new Error('User not found!');
        }
        const isValid = await verifyPassword(password, existingUser.password);

        if (!isValid) {
          client.close();
          throw new Error('Wrong credentials!');
        }

        client.close();
        return {
          email: existingUser.email,
        };
      },
      credentials: {
        email: {},
        password: {},
      },
    }),
  ],
};

export default NextAuth(authOptions);
