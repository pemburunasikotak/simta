import { getListFacilities } from "@/api/master-data/facilities/api";
import { TFacilitiesFilter } from "@/api/master-data/facilities/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListFacilities = (params?: TFacilitiesFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.facilities.list, params],
    queryFn: () => getListFacilities(params),
  });
};

export default useGetListFacilities;
