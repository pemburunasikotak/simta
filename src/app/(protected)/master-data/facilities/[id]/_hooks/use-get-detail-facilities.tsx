import { getDetailFacilities } from "@/api/master-data/facilities/api";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailFacilities = (params?: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.facilities.detail, params],
    queryFn: () => getDetailFacilities(params),
  });
};

export default useGetDetailFacilities;
