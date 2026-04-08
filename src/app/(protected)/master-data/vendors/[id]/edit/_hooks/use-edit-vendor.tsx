import { editVendor } from "@/api/master-data/vendors/api";
import { TDetailParams } from "@/api/common";
import { TVendorRequest } from "@/api/master-data/vendors/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditVendor = (params: TDetailParams) => {
  return useMutation({
    mutationKey: ["edit-vendor", params],
    mutationFn: (data: TVendorRequest) => editVendor(params, data),
  });
};

export default useEditVendor;
