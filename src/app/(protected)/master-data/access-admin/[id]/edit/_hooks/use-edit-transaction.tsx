import { TDetailParams } from "@/api/common";
import { editAccessAdmin } from "@/api/master-data/access-admin/api";
import { TAccessAdminRequest } from "@/api/master-data/access-admin/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditTransaction = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-transaction"],
    mutationFn: (req: TAccessAdminRequest) => editAccessAdmin(params, req),
  });
};

export default useEditTransaction;
