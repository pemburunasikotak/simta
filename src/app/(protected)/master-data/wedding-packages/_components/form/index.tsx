import { useEffect } from "react";
import { Button, Grid, Stack, Chip, FormControl, FormLabel } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Autocomplete, TextField } from "@mui/material";

import FormTextField from "@/app/_components/ui/form-text-field";
import useGetListFacilities from "@/app/(protected)/master-data/facilities/_hooks/use-get-list-facilities";

import { WeddingPackagesSchema, TWeddingPackagesFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TWeddingPackagesFormData) => void;
  defaultValues?: Partial<TWeddingPackagesFormData>;
}

const WeddingPackagesForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TWeddingPackagesFormData>({
    resolver: zodResolver(WeddingPackagesSchema),
    mode: "onChange",
  });

  const facilitiesQuery = useGetListFacilities();
  const facilitiesOptions = facilitiesQuery.data?.result.data || [];

  useEffect(() => {
    form.reset({
      ...defaultValues,
    });
  }, [form, defaultValues]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            variant="filled"
            label="Nama Paket"
            control={form.control}
            name="package_name"
            required
            placeholder="Ex: Paket Silver"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            variant="filled"
            label="Type Paket"
            control={form.control}
            name="package_type"
            required
            placeholder="Ex: Basic, Premium, Luxury"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="package_facilities"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <FormLabel htmlFor={field.name} error={fieldState.invalid} required>
                  Fasilitas Paket
                </FormLabel>
                <Autocomplete
                  multiple
                  options={facilitiesOptions}
                  getOptionLabel={(option) => option.name}
                  value={facilitiesOptions.filter((facility) => field.value?.includes(facility.id))}
                  onChange={(_, newValue) => {
                    field.onChange(newValue.map((facility) => facility.id));
                  }}
                  renderValue={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Pilih fasilitas"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </FormControl>
            )}
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

export default WeddingPackagesForm;
