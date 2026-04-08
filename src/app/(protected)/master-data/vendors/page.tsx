import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";

import { TVendor, TVendorFilter } from "@/api/master-data/vendors/type";
import useGetListVendors from "./_hooks/use-get-list-vendors";
import { paths } from "@/commons/constants/paths";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";

const Component: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TVendorFilter>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const query = useGetListVendors({
    sort_by: "created_at",
    order: filters.order || "DESC",
    limit: 10,
    page: filters.page || 1,
  });

  const columns: GridColDef<TVendor>[] = [
    { field: "vendor_id", headerName: "ID Vendor", width: 100 },
    { field: "name", headerName: "Nama Vendor", width: 200 },
    { 
      field: "type", 
      headerName: "Type Vendor", 
      width: 150,
      renderCell: (params) => params.row.type.name,
    },
    {
      field: "logo",
      headerName: "Logo Vendor",
      width: 150,
      renderCell: (params) => (params.row.logo ? <img src={params.row.logo} width="50" /> : "-"),
    },
    { field: "description", headerName: "Deskripsi", width: 250 },
    { field: "total_booking", headerName: "Total Booking", width: 150 },
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
                  generatePath(paths.master_data.vendors.edit, { id: params.row.vendor_id }),
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
          label: "Vendor",
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
              onClick={() => navigate(paths.master_data.vendors.create)}
            >
              Tambah Vendor
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
        getRowId={(row: TVendor) => row.vendor_id}
        loading={query.isLoading}
        rows={query.data?.result.data}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: query.data?.result.total_page || 1,
          total: query.data?.result.total || 0,
          page: query.data?.result.current_page || 1,
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
