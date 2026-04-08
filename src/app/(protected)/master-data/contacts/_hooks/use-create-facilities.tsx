import { editContact } from "@/api/master-data/contact/api";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useEditContact = () => {
  return useMutation({
    mutationKey: ["edit-contact"],
    mutationFn: editContact,
  });
};

export default useEditContact;
