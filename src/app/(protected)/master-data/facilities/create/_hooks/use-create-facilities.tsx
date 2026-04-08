import { createFacilities } from "@/api/master-data/facilities/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateFacilities = () => {
  return useMutation({
    mutationKey: ["create-facilities"],
    mutationFn: createFacilities,
  });
};

export default useCreateFacilities;
