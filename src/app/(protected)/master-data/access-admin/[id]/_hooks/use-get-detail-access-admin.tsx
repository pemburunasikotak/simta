import { TDetailParams } from "@/api/common";
import { getDetailAccessAdmin } from "@/api/master-data/access-admin/api";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailAccessAdmin = (params?: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.accessAdmin.detail, params],
    queryFn: () => getDetailAccessAdmin(params),
  });
};

export default useGetDetailAccessAdmin;
