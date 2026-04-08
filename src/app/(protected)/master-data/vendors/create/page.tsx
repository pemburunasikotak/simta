import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TVendorRequest } from "@/api/master-data/vendors/type";

import VendorForm from "../_components/form";
import useCreateVendor from "./_hooks/use-create-vendor";
import { TVendorFormData } from "../_components/form/schema";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateVendor();

  const handleSubmit = (data: TVendorFormData) => {
    // Transform the form data to match the API request format
    const payload: TVendorRequest = {
      name: data.name,
      type: {
        id: data.type.value,
        name: data.type.label,
      },
      logo: data.logo,
      description: data.description,
      total_booking: data.total_booking,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Vendor", { variant: "success" });
        navigate(paths.master_data.vendors.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Vendor", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Vendor"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master_data.vendors.list,
        },
        {
          label: "Vendor",
          path: paths.master_data.vendors.list,
        },
        {
          label: "Tambah Vendor",
          path: null,
        },
      ]}
    >
      <VendorForm loading={mutation.isPending} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;
