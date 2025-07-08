import { Add } from '@mui/icons-material'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { CustomQuickFilter, CustomToolbarContainer } from './DataGrid'

type Props = {
  action: () => void,
  buttonText: string,
}

const CustomToolBar = (props: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '50px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', p: 1, mb: 1 }}>
      <Box sx={{ display: 'flex' }}>
        <CustomQuickFilter placeholder="Buscar itens..." variant={'filled'} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button color="secondary" variant="contained" sx={{ mb: 1 }} onClick={() => props.action()}>
          <Add sx={{ marginRight: '3px' }} />
          {props.buttonText}
        </Button>
      </Box>
    </CustomToolbarContainer>
  )
}

export default CustomToolBar