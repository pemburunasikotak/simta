import { TDetailParams } from "@/api/common";
import { editWeddingPackages } from "@/api/master-data/wedding-packages/api";
import { TWeddingPackagesRequest } from "@/api/master-data/wedding-packages/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditWeddingPackages = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-wedding-packages"],
    mutationFn: (req: TWeddingPackagesRequest) => editWeddingPackages(params, req),
  });
};

export default useEditWeddingPackages;
