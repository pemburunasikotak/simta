import { getDetailWeddingPackages } from "@/api/master-data/wedding-packages/api";
import { TDetailParams } from "@/api/common";
import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";

const useGetDetailWeddingPackages = (params?: TDetailParams) => {
  return useQuery({
    queryKey: [queryKeys.masterData.weddingPackages.detail, params],
    queryFn: () => getDetailWeddingPackages(params),
  });
};

export default useGetDetailWeddingPackages;
