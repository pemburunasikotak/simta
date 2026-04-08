import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TWeddingPackagesRequest } from "@/api/master-data/wedding-packages/type";

import WeddingPackagesForm from "../_components/form";
import useCreateWeddingPackages from "./_hooks/use-create-wedding-packages";
import { TWeddingPackagesFormData } from "../_components/form/schema";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateWeddingPackages();

  const handleSubmit = (data: TWeddingPackagesFormData) => {
    const payload: TWeddingPackagesRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Paket Pernikahan", { variant: "success" });
        navigate(paths.master_data.wedding_packages.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Paket Pernikahan", { variant: "error" });
      },
    });
  };

  return (
    <Page
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
          label: "Tambah Paket Pernikahan",
          path: null,
        },
      ]}
    >
      <WeddingPackagesForm loading={false} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;
