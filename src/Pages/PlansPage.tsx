import { Add } from '@mui/icons-material';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams';
import { useState } from 'react';
import { getColumns } from '../Components/ColumnsDefinitions/PlansColumns';
import { CustomQuickFilter, CustomToolbarContainer, StyledDataGrid } from '../Components/DataGrid';
import ModalCRUDPlans from '../Components/Modal/ModalCRUDPlans';
import PageHeader from '../Components/PageHeader';
type Props = {}

type Plans = {
  id: number
  name: string
  playlists: number
  templates: number
  space: number
  meses: number
}

const plans: Plans[] = [
  {
    id: 1,
    name: 'Teste',
    playlists: 1,
    templates: 1,
    space: 100, // em Mb
    meses: 1,
  },
  {
    id: 2,
    name: 'Simples',
    playlists: 3,
    templates: 5,
    space: 500, // em Mb
    meses: 6,
  },
  {
    id: 3,
    name: 'Plus',
    playlists: 5,
    templates: 8,
    space: 2000, // em Mb
    meses: 12,
  },
  {
    id: 4,
    name: 'Pro',
    playlists: 50,
    templates: 100,
    space: 5000, // em Mb
    meses: 24,
  },
];



const PlansPage = (props: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  function handleOpen() { setOpen(true) };
  function handleClose() { setOpen(false) };

  const CustomToolbar = () => {
    return (
      <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '50px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <CustomQuickFilter placeholder="Buscar planos..." variant={'filled'} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button color="secondary" variant="contained" sx={{ mr: 1 }} onClick={() => handleOpen()}>
            <Add sx={{ marginRight: '3px' }} />
            Novo Plano
          </Button>
        </Box>
      </CustomToolbarContainer>
    )
  }

  function handleRowDoubleClick(params: GridRowParams<any>): void {
    handleOpen()
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <ModalCRUDPlans onClose={handleClose} open={open} />
      <PageHeader title={"Planos"} desc={"Gerencie seus planos!"} help={<Box> Não tem</Box>}/>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3 }}>
        <StyledDataGrid
          sx={{ maxWidth: '98%' }}
          rows={plans}
          columns={getColumns()[isMobile ? 1 : 0]}
          getRowId={(row) => row.id || row.name}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          onRowDoubleClick={handleRowDoubleClick}
          /* onRowSelectionModelChange={handleSelectionChange}
          processRowUpdate={handleProcessRowUpdate} */
          density={isMobile ? "compact" : 'standard'}
          sortingOrder={['desc', 'asc']}

        /* onCellEditStart={handleCellEditStart} */
        />
      </Box>


    </Box>
  )
}

export default PlansPage