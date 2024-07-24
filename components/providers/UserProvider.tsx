import { useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { User } from '../../models/User';
import { UserContext } from '../../contexts/userContext';
import { useSession } from 'next-auth/react';

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const { data: session } = useSession();

  const [user, setUser] = useState<User>();
  const changeUser = useCallback((newUser?: User) => {
    setUser(newUser);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      changeUser,
    }),
    [user, changeUser]
  );

  useEffect(() => {
    setUser(session?.user as User);
  }, [session?.user]);

  return (
    <UserContext.Provider value={contextValue}>
      <>{children}</>
    </UserContext.Provider>
  );
};
