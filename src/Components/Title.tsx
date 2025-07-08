import { Typography, useMediaQuery, useTheme } from '@mui/material'

type Props = {
  text: string
}

const Title = (props: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Typography variant='h1' sx={{ ml: isMobile ? 1 : 4, mt: 3 }}>{props.text}</Typography>
  )
}

export default Title