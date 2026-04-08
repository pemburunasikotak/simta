import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";

import { TAccessAdmin, TAccessAdminFilter } from "@/api/master-data/access-admin/type";
import useGetListAccessAdmin from "./_hooks/use-get-list-access-admin";
import { paths } from "@/commons/constants/paths";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";

const Component: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TAccessAdminFilter>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const query = useGetListAccessAdmin({
    sort_by: "created_at",
    order: filters.order || "DESC",
    limit: 10,
    page: filters.page || 1,
  });

  const columns: GridColDef<TAccessAdmin>[] = [
    { field: "user_id", headerName: "ID User", width: 80 },
    { field: "fullname", headerName: "Nama Lengkap", width: 200 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "password", headerName: "Password", width: 150 },
    {
      field: "foto",
      headerName: "Foto Profil",
      width: 150,
      renderCell: (params) => (params.row.foto ? <img src={params.row.foto} /> : "-"), // TODO: preview image
    },
    { field: "role", headerName: "Role", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "No. Whatsapp", width: 150 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "edit",
              type: "edit",
              onClick: () =>
                navigate(
                  generatePath(paths.master_data.access_admin.edit, { id: params.row.user_id }),
                ),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => {},
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Master Data",
          path: null,
        },
        {
          label: "Akses Admin",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          defaultValue={{
            search_value: filters.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.master_data.access_admin.create)}
            >
              Tambah Admin
            </Button>,
            ...(selectedIds.length
              ? [
                  <Button key="delete" variant="outlined" startIcon={<DeleteOutlined />}>
                    Delete
                  </Button>,
                ]
              : []),
          ]}
        />
      }
    >
      <DataTable
        getRowId={(row: TAccessAdmin) => row.user_id}
        loading={false}
        rows={query.data?.result.data}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: 5,
          total: 10,
          page: 1,
        })}
        handleChange={setFilter}
        onRowSelectionModelChange={(ids) => {
          setSelectedIds(ids);
        }}
      />
    </Page>
  );
};

export default Component;
