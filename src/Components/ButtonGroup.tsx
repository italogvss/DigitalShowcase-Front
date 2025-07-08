import { ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledToggleButtonGroup = styled((props: ToggleButtonGroupProps) => {
  const { size = "medium", ...rest } = props;
  return <ToggleButtonGroup size={size} {...rest} />;
})(({ theme }) => ({
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));