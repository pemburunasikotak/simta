import { getListWeddingPackages } from "@/api/master-data/wedding-packages/api";
import { TWeddingPackagesFilter } from "@/api/master-data/wedding-packages/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetListWeddingPackages = (params?: TWeddingPackagesFilter) => {
  return useQuery({
    queryKey: [queryKeys.masterData.weddingPackages.list, params],
    queryFn: () => getListWeddingPackages(params),
  });
};

export default useGetListWeddingPackages;
