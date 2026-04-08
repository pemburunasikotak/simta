import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";

import { paths } from "@/commons/constants/paths";
import { Page } from "@/app/_components/ui";
import { TTransactionRequest } from "@/api/transactions/type";

import TransactionForm from "../_components/form";
import useCreateTransaction from "./_hooks/use-create-transaction";
import { TTransactionFormData } from "../_components/form/schema";

const CreateTransactionPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useCreateTransaction();

  const handleSubmit = (data: TTransactionFormData) => {
    const payload: TTransactionRequest = data;

    mutation.mutate(payload, {
      onSuccess: () => {
        enqueueSnackbar("Berhasil menambahkan Transaksi", { variant: "success" });
        navigate(paths.transaction.list);
      },
      onError: () => {
        enqueueSnackbar("Gagal menambahkan Transaksi", { variant: "error" });
      },
    });
  };

  return (
    <Page
      title="Data Transaksi"
      breadcrumbs={[
        {
          label: "Transaksi",
          path: "/transactions",
        },
        {
          label: "Tambah Transaksi",
          path: null,
        },
      ]}
    >
      <TransactionForm loading={false} handleSubmit={handleSubmit} defaultValues={{}} />
    </Page>
  );
};

export default CreateTransactionPage;
