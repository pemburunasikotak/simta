import { TDetailParams } from "@/api/common";
import { editFacilities } from "@/api/master-data/facilities/api";
import { TFacilitiesRequest } from "@/api/master-data/facilities/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditFacilities = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-facilities"],
    mutationFn: (req: TFacilitiesRequest) => editFacilities(params, req),
  });
};

export default useEditFacilities;
