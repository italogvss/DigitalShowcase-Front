import { Warning } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {}

const NotFoundPage = (props: Props) => {
  const navigate = useNavigate()
  return (
    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "90vh", flexDirection: "column"}}>
      <Warning color="secondary" sx={{fontSize: "80px"}}/>
      <Typography variant='h1'>Erro 404</Typography>
      <Typography variant='h3' sx={{mb: 4}}>Essa pagina não existe</Typography>
      <Button onClick={() => navigate("/login")} variant='contained' color="secondary" size='large'>Voltar</Button>
    </Box>
  )
}

export default NotFoundPage