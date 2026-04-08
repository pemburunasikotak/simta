import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TAccessAdminRequest } from "@/api/master-data/access-admin/type";

import AccessAdminForm from "../_components/form";
import useCreateAccessAdmin from "./_hooks/use-create-access-admin";
import { TAccessAdminFormData } from "../_components/form/schema";

const CreatePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateAccessAdmin();

  const handleSubmit = (data: TAccessAdminFormData) => {
    const payload: TAccessAdminRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Admin", { variant: "success" });
        navigate(paths.master_data.access_admin.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Admin", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Admin"
      breadcrumbs={[
        {
          label: "Master Data",
          path: paths.master_data.access_admin.list,
        },
        {
          label: "Akses Admin",
          path: paths.master_data.access_admin.list,
        },
        {
          label: "Tambah Admin",
          path: null,
        },
      ]}
    >
      <AccessAdminForm loading={false} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreatePage;
