import { TextField, TextFieldProps } from "@mui/material";
import styled from "@mui/material/styles/styled";

export const StyledTextField = styled((props: TextFieldProps) => {
  const { fullWidth = true, ...rest} = props;
  return <TextField {...rest} fullWidth={fullWidth} size="small" variant="outlined"/>;
})(({ theme }) => ({
  /* backgroundColor: theme.palette.grey[300], */
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));