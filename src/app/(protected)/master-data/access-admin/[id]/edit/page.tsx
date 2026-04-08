import { useNavigate, useParams } from "react-router";
import { useSnackbar } from "notistack";

import { Page } from "@/app/_components/ui";
import { TAccessAdminRequest } from "@/api/master-data/access-admin/type";
import { paths } from "@/commons/constants/paths";

import { TAccessAdminFormData } from "../../_components/form/schema";
import AccessAdminForm from "../../_components/form";
import useEditTransaction from "./_hooks/use-edit-transaction";
import useGetDetailAccessAdmin from "../_hooks/use-get-detail-access-admin";

const CreateTransactionPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const query = useGetDetailAccessAdmin({ id: params.id! });

  const data = query.data?.result;

  const mutation = useEditTransaction({ id: params.id! });

  const handleSubmit = (data: TAccessAdminFormData) => {
    const payload: TAccessAdminRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil mengubah Akses Admin", { variant: "success" });
        navigate(paths.master_data.access_admin.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengubah Akses Admin", { variant: "error" });
      },
    });
  };

  return (
    <Page
      loading={query.isLoading}
      title="Data Transaksi"
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
          label: "Edit Admin",
          path: null,
        },
      ]}
    >
      <AccessAdminForm
        loading={mutation.isPending}
        handleSubmit={handleSubmit}
        defaultValues={{
          fullname: data?.fullname,
          email: data?.email,
          phone: data?.phone,
          username: data?.username,
          password: data?.password,
          role: data?.role,
          foto: data?.foto,
        }}
      />
    </Page>
  );
};

export default CreateTransactionPage;
