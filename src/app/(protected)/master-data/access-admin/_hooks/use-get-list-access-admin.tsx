import { getListAccessAdmin } from "@/api/master-data/access-admin/api";
import { TAccessAdminFilter } from "@/api/master-data/access-admin/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListAccessAdmin = (params?: TAccessAdminFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.accessAdmin.list, params],
    queryFn: getListAccessAdmin,
  });
};

export default useGetListAccessAdmin;
