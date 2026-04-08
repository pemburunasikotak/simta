import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";

import FacilitiesForm from "./_components/form";
import useEditContact from "./_hooks/use-create-facilities";
import { TContactFormData } from "./_components/form/schema";
import { TContactRequest } from "@/api/master-data/contact/type";
import useGetDetailContact from "./_hooks/use-get-detail-facilities";

const ContactPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const query = useGetDetailContact();
  const mutation = useEditContact();

  const data = query.data?.result;

  const handleSubmit = (data: TContactFormData) => {
    const payload: TContactRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Data Perusahaan", { variant: "success" });
        navigate(paths.master_data.facilities.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Data Perusahaan", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Perusahaan"
      breadcrumbs={[
        {
          label: "Master Data",
          path: null,
        },
        {
          label: "Kontak",
          path: null,
        },
      ]}
      loading={query.isLoading}
    >
      <FacilitiesForm
        loading={false}
        handleSubmit={handleSubmit}
        defaultValues={{
          name: data?.name,
          phone: data?.phone,
          wa: data?.wa,
          email: data?.email,
          address: data?.address,
        }}
      />
    </Page>
  );
};

export default ContactPage;
