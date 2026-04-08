import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormTextField from "@/app/_components/ui/form-text-field";

import { ContactSchema, TContactFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TContactFormData) => void;
  defaultValues?: Partial<TContactFormData>;
}

const FacilitiesForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TContactFormData>({
    resolver: zodResolver(ContactSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
    });
  }, [form]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Nama Perusahaan"
            control={form.control}
            name="name"
            required
            placeholder="Ex: Aula Utama"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="No. Telepon"
            control={form.control}
            name="phone"
            required
            placeholder="Ex: 021 - 345 - 567"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="No. Whatsapp"
            control={form.control}
            name="wa"
            required
            placeholder="Ex: 082212344321"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Email"
            control={form.control}
            name="email"
            required
            placeholder="Ex: johndoe@gmail.com"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormTextField
            label="Alamat"
            control={form.control}
            name="address"
            required
            placeholder="Ex: Jakal Km.15"
            multiline
            rows={4}
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

export default FacilitiesForm;
