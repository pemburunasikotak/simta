import { createAccessAdmin } from "@/api/master-data/access-admin/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateAccessAdmin = () => {
  return useMutation({
    mutationKey: ["create-access-admin"],
    mutationFn: createAccessAdmin,
  });
};

export default useCreateAccessAdmin;
