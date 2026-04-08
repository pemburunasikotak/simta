import { useQuery } from "@/app/_hooks/request/use-query";
import { queryKeys } from "@/commons/constants/query-key";
import { getDetailContact } from "@/api/master-data/contact/api";

const useGetDetailContact = () => {
  return useQuery({
    queryKey: [queryKeys.masterData.contact.detail],
    queryFn: () => getDetailContact(),
  });
};

export default useGetDetailContact;
