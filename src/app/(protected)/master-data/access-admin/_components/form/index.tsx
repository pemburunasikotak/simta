import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import FormTextField from "@/app/_components/ui/form-text-field";

import { AccessAdminSchema, TAccessAdminFormData } from "./schema";
import FormUploadField from "@/app/_components/ui/form-upload-field";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TAccessAdminFormData) => void;
  defaultValues?: Partial<TAccessAdminFormData>;
}

const AccessAdminForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TAccessAdminFormData>({
    resolver: zodResolver(AccessAdminSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, []);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            variant="filled"
            label="Nama Lengkap"
            control={form.control}
            name="fullname"
            required
            placeholder="Ex: johndoe"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Username"
            control={form.control}
            name="username"
            required
            placeholder="Ex. johndoe"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Password"
            control={form.control}
            name="password"
            required
            placeholder="Ex. *******"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Role Akses"
            control={form.control}
            name="role"
            required
            placeholder="Pilih Role"
            options={[
              {
                label: "Reporting",
                value: "reporting",
              },
              {
                label: "Management",
                value: "management",
              },
              {
                label: "Editor",
                value: "editor",
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            control={form.control}
            name="foto"
            render={({ field, fieldState }) => (
              <FormUploadField
                label="Upload Foto"
                uploadDesc="Format Foto JPG, PNG, JPEG. Ukuran Maksimal 2 MB"
                name={field.name}
                value={field.value}
                error={fieldState.invalid}
                helper={fieldState.error?.message}
                required
                onChange={() => {
                  // handleUpload("image_url", event);
                }}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Email"
            control={form.control}
            name="email"
            required
            placeholder="Ex. john@doe.com"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="No. Whatsapp"
            control={form.control}
            name="phone"
            required
            placeholder="Ex. 09888733483"
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

export default AccessAdminForm;
