import React from "react";
import { Box, Button, ButtonProps, FormControl, FormLabel, Stack, styled } from "@mui/material";
import HelperText from "../helper-text";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface UploadProps extends ButtonProps {
  error?: boolean;
}

const Upload = styled(Button, {
  shouldForwardProp: (prop) => prop !== "error",
})<UploadProps>(({ theme }) => ({
  backgroundColor: theme.palette.text.disabled,
  width: "150px",
}));

interface Props {
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  error?: boolean;
  required?: boolean;
  helper?: string;
  acceptFormat?: string;
  acceptLabel?: string;
  uploadDesc?: string;
}

const FormUploadField = ({
  acceptFormat = ".jpg,.jpeg,.png",
  // acceptLabel = "JPG, JPEG, PNG",
  uploadDesc = "Maksimal 2 Mb",
  helper,
  required,
  error,
  label,
  name,
  onChange,
  value,
}: Props) => {
  return (
    <FormControl required={required} style={{ width: "100%" }}>
      <FormLabel htmlFor={name} error={!!error} required={required}>
        {label}
      </FormLabel>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Upload error={error} component="label" variant="contained">
          Pilih Pile
          <VisuallyHiddenInput id={name} type="file" onChange={onChange} accept={acceptFormat} />
        </Upload>

        <HelperText>{value}</HelperText>
      </Box>
      <Stack direction="row" justifyContent="space-between">
        <HelperText>{uploadDesc}</HelperText>
      </Stack>
      {helper ? <HelperText error={error}>{helper}</HelperText> : null}
    </FormControl>
  );
};

export default FormUploadField;
