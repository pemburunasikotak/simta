import { useEffect } from "react";
import { useNavigate } from "react-router";

const Page = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/auth/login", { replace: true });
    }, [navigate]);

    return null;
};

export default Page;
