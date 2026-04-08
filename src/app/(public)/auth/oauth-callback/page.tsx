import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { SessionToken } from "@/libs/cookies";
import { useSession } from "@/app/_components/providers/session";
import { paths } from "@/commons/constants/paths";

const Component = () => {
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  const { signin } = useSession();

  const signInCallback = async () => {
    const code = searchParams[0].get("code");
    if (!code) return navigate("/auth/login");
    signin({ code });
  };

  useEffect(() => {
    signInCallback();
  }, []);

  useEffect(() => {
    const session = SessionToken.get();
    if (session) navigate(paths.dashboard);
  }, []);

  return <div>Redirecting...</div>;
};

export default Component;
