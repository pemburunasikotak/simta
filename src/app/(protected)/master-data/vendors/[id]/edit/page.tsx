import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TVendorRequest } from "@/api/master-data/vendors/type";
import { paths } from "@/commons/constants/paths";

import { TVendorFormData } from "../../_components/form/schema";
import VendorForm from "../../_components/form";
import useEditVendor from "./_hooks/use-edit-vendor";
import useGetDetailVendor from "../_hooks/use-get-detail-vendor";

const EditVendorPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailVendor({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditVendor({ id: params.id! });

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
        enqueueSnackbar("Berhasil mengubah Vendor", { variant: "success" });
        navigate(paths.master_data.vendors.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Vendor", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
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
          label: "Edit Vendor",
          path: null,
        },
      ]}
    >
      <VendorForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          name: data?.name,
          type: data ? { value: data.type.id, label: data.type.name } : undefined,
          logo: data?.logo,
          description: data?.description,
          total_booking: data?.total_booking,
        }}
      />
    </Page>
  );
};

export default EditVendorPage;
