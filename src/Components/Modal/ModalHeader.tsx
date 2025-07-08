import React from 'react'
import Grid from '@mui/material/Grid2';
import { Close } from '@mui/icons-material';
import { Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
type Props = {
  onClose: () => void
  title: string
}

const ModalHeader = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid container width={'100%'}>
              <Grid size={11}>
                <Typography variant={isMobile ? 'h3' : 'h2'} sx={{ mb: 2 }}>{props.title}</Typography>
              </Grid>
              <Grid size={1} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'start' }}>
                <IconButton onClick={() => props.onClose()}>
                <Close fontSize='large'/>
                </IconButton>
              </Grid>
            </Grid>
  )
}

export default ModalHeader