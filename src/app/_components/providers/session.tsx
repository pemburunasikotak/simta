import { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router";

import { TLoginOidcParam } from "@/api/auth/type";
import { SessionUser } from "@/libs/localstorage";
import { SessionToken } from "@/libs/cookies";
import { usePostLoginOidc } from "@/app/(public)/auth/oauth-callback/_hooks/use-post-login-oidc";
import { TUserItem } from "@/api/user/type";
import { supabase } from "@/libs/supabase";

type Session = {
  signin: (payload: TLoginOidcParam) => void;
  signout: () => void;
  session?: {
    access_token: string;
    refresh_token: string;
    user?: TUserItem;
  };
  status?: "authenticated" | "authenticating" | "unauthenticated";
};

const SessionContext = createContext<Session>({
  signin: () => { },
  signout: () => { },
  session: undefined,
  status: undefined,
});

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<Session["session"]>();
  const [status, setStatus] = useState<Session["status"]>("authenticating");

  const { mutate: oidcMutate } = usePostLoginOidc();

  useEffect(() => {
    // Initial session check from LocalStorage
    const checkSession = () => {
      const storedSession = SessionUser.get();
      if (storedSession && storedSession.user) {
        setSessionData(storedSession);
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
      }
    };

    checkSession();
  }, []);

  const signin = (payload: TLoginOidcParam) => {
    setStatus("authenticating");
    oidcMutate(payload, {
      onSuccess: (res) => {
        setSessionData(res.data);
        setStatus("authenticated");
        SessionUser.set(res.data);
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      },
      onError: () => {
        setStatus("unauthenticated");
      },
    });
  };

  const signout = async () => {
    // Manual signout
    setSessionData(undefined);
    setStatus("unauthenticated");
    SessionUser.remove();
    SessionToken.remove();
    navigate("/auth/login");
  };

  return (
    <SessionContext.Provider
      value={{
        session: sessionData,
        status,
        signin,
        signout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionProvider;
