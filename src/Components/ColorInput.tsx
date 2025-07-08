import styled from "@mui/material/styles/styled";
import { MuiColorInput, MuiColorInputProps } from "mui-color-input";

export const ColorInput = styled((props: MuiColorInputProps) => {
  const { fullWidth = true, ...rest } = props;
  return <MuiColorInput {...rest} fullWidth={fullWidth} size="small" variant="outlined" />;
})(({ theme }) => ({

  '& .MuiColorInput-Button': {
    width: '30px', height: '30px',

  }
}));