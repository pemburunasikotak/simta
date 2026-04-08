import { getListVendors } from "@/api/master-data/vendors/api";
import { TVendorFilter } from "@/api/master-data/vendors/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListVendors = (params?: TVendorFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.vendors.list, params],
    queryFn: getListVendors,
  });
};

export default useGetListVendors;
