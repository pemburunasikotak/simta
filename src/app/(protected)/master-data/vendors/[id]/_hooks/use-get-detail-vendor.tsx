import { getDetailVendor } from "@/api/master-data/vendors/api";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailVendor = (params: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.vendors.detail, params],
    queryFn: () => getDetailVendor(params),
  });
};

export default useGetDetailVendor;
