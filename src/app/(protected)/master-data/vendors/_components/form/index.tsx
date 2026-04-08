import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormAutoCompleteField from "@/app/_components/ui/form-auto-complete";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormUploadField from "@/app/_components/ui/form-upload-field";

import { VendorSchema, TVendorFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TVendorFormData) => void;
  defaultValues?: Partial<TVendorFormData>;
}

const VendorForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TVendorFormData>({
    resolver: zodResolver(VendorSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            variant="filled"
            label="Nama Vendor"
            control={form.control}
            name="name"
            required
            placeholder="Ex: Elegant Decor"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormAutoCompleteField
            label="Type Vendor"
            control={form.control}
            defaultValue={defaultValues?.type}
            name="type"
            required
            placeholder="Pilih Type Vendor"
            options={[
              {
                label: "Decoration",
                value: "1",
              },
              {
                label: "Catering",
                value: "2",
              },
              {
                label: "Photography",
                value: "3",
              },
              {
                label: "Entertainment",
                value: "4",
              },
              {
                label: "Florist",
                value: "5",
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Total Booking"
            control={form.control}
            name="total_booking"
            required
            type="number"
            placeholder="Ex: 45"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={form.control}
            name="logo"
            render={({ field, fieldState }) => (
              <FormUploadField
                label="Upload Logo"
                uploadDesc="Format Logo JPG, PNG, JPEG. Ukuran Maksimal 2 MB"
                name={field.name}
                value={field.value}
                error={fieldState.invalid}
                helper={fieldState.error?.message}
                required
                onChange={() => {
                  // handleUpload("logo", event);
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label="Deskripsi"
            control={form.control}
            name="description"
            required
            multiline
            rows={4}
            placeholder="Ex: Specializing in elegant wedding decorations and setups"
          />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: "24px",
        }}
      >
        <Button loading={loading} type="submit" variant="contained">
          Simpan
        </Button>
      </Stack>
    </form>
  );
};

export default VendorForm;
