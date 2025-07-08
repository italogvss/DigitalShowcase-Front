import { Person } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

type Props = {
  title: string
  icon: JSX.Element
}

const InfoTitle = (props: Props) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1}}>
      <Typography variant='h3'>{props.title}</Typography>
      {props.icon}
    </Box>
  )
}

export default InfoTitle