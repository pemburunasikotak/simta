import { createWeddingPackages } from "@/api/master-data/wedding-packages/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateWeddingPackages = () => {
  return useMutation({
    mutationKey: ["create-wedding-packages"],
    mutationFn: createWeddingPackages,
  });
};

export default useCreateWeddingPackages;
