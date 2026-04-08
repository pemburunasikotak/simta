import { createVendor } from "@/api/master-data/vendors/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateVendor = () => {
  return useMutation({
    mutationKey: ["create-vendor"],
    mutationFn: createVendor,
  });
};

export default useCreateVendor;
