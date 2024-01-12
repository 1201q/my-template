import { getAuth, User } from "firebase/auth";
import React, {
  useState,
  useEffect,
  createContext,
  useMemo,
  useContext,
} from "react";
import nookies from "nookies";

const AuthContext = createContext<User | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userState, setUserState] = useState<User | null>(null);

  useEffect(() => {
    return getAuth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUserState(null);
        nookies.set(null, "token", "", { path: "/" });
      } else {
        setUserState(user);
        const token = await user.getIdToken();
        nookies.destroy(null, "token");
        nookies.set(null, "token", token, { path: "/" });
      }
    });
  }, []);

  useEffect(() => {
    const refreshToken = setInterval(async () => {
      const { currentUser } = getAuth();

      if (currentUser) {
        await currentUser.getIdToken(true);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(refreshToken);
  }, []);

  const userData = useMemo(() => userState, [userState]);

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
