import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TWeddingPackagesRequest } from "@/api/master-data/wedding-packages/type";
import { paths } from "@/commons/constants/paths";

import { TWeddingPackagesFormData } from "../../_components/form/schema";
import WeddingPackagesForm from "../../_components/form";
import useEditWeddingPackages from "./_hooks/use-edit-wedding-packages";
import useGetDetailWeddingPackages from "../_hooks/use-get-detail-wedding-packages";

const EditWeddingPackagesPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailWeddingPackages({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditWeddingPackages({ id: params.id! });

  const handleSubmit = (data: TWeddingPackagesFormData) => {
    const payload: TWeddingPackagesRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Paket Pernikahan", { variant: "success" });
        navigate(paths.master_data.wedding_packages.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Paket Pernikahan", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
      title="Data Paket Pernikahan"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master_data.wedding_packages.list,
        },
        {
          label: "Paket Pernikahan",
          path: paths.master_data.wedding_packages.list,
        },
        {
          label: "Edit Paket Pernikahan",
          path: null,
        },
      ]}
    >
      <WeddingPackagesForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          package_name: data?.package_name,
          package_type: data?.package_type,
          package_facilities: data?.package_facilities?.map((facility) => facility.id) || [],
        }}
      />
    </Page>
  );
};

export default EditWeddingPackagesPage;
