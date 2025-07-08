import { Add } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getColumns } from '../../Components/ColumnsDefinitions/TemplateColumns'
import { CustomToolbarContainer, CustomQuickFilter, StyledDataGrid } from '../../Components/DataGrid'
import DialogQuiz from '../../Components/Modal/DialogQuiz'
import PageHeader from '../../Components/PageHeader'
import { Template } from '../../Model/TemplateModel'
import { useFindAllMediaQuery } from '../../service/MediaService'
import { useDeleteTemplateMutation, useFindAllTemplatesQuery, useFindAllDefaultTemplatesQuery } from '../../service/TemplateService'
import { useAppSelector } from '../../store/hooks'
import Helper from './Helper'


type Props = {}

const TemplatesPage = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State hooks
  const [openDialog, setOpenDialog] = useState(false);

  // Redux hooks
  const user = useAppSelector(state => state.auth.user);
  const templates = useAppSelector(state => state.template);

  // Navigation hook
  const navigate = useNavigate();

  // API hooks
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation();
  useFindAllMediaQuery(user?.id?.toString() || '', { skip: templates.length > 0,  });
  useFindAllTemplatesQuery(user?.id?.toString() || '', { skip: templates.length > 0,  });
  useFindAllDefaultTemplatesQuery(undefined,{ skip: templates.some(t => t.isDefault), refetchOnMountOrArgChange: true  });
  // Refs
  const idToDelete = useRef<null | number>(null);


  const handleClickOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option && idToDelete.current) await deleteTemplate(idToDelete.current).unwrap()
      .then(() => { toast.success("Template excluido") })
  }
  function handleAdd() { navigate(`/templates/edit/novo`) }
  const handleEdit = useCallback((params: GridRowParams<Template>) => { 
    if (!user) return; 
    if (params.row.isDefault && user.role !== "ADMIN") {
      toast.error("Não é possivel editar um template padrão do sistema")
      return
    };
    if(user.role === "ADMIN"){
      toast.warn("Muito cuidado ao editar um template padrão do sistema, sera modificado para todos os usuarios")
    }
    navigate('edit/' + params.id);  
}, [navigate, user]);
  const handleDelete = useCallback(async (params: GridRowParams<Template>) => {
    if (!user) return; 
    if (params.row.isDefault && user.role !== "ADMIN")  {
      toast.error("Não é possivel deletar um template padrão do sistema")
      return
    };
    idToDelete.current = params.id as number
    handleClickOpenDialog()
  }, [handleClickOpenDialog]);
  const columns = useMemo(() => {
    return getColumns(handleEdit, handleDelete)[isMobile ? 1 : 0];
  }, [handleEdit, handleDelete, isMobile]);

  const CustomToolbar = () => {
    return (
      <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '50px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <CustomQuickFilter placeholder="Buscar templates..." variant={'filled'} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <LoadingButton loading={isDeleting} color="secondary" variant="contained" sx={{ mr: 1 }} onClick={() => handleAdd()}
            startIcon={<Add sx={{ marginRight: '3px' }} />}>
            Novo Template
          </LoadingButton>
        </Box>
      </CustomToolbarContainer>
    )
  }
  function handleRowDoubleClick(params: GridRowParams<Template>): void {
    handleEdit(params)
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <DialogQuiz title={"Confirmar exclusão do template?"}
        text={user?.role === "ADMIN" ?
           "Por favor, reconsidere não deletar esse template, pode haver usuarios o utilizando!":
           "Este template sera removido de todas as playlists que fizer parte"}
        open={openDialog} handleClose={handleCloseDialog}
        variant="warning" />
      <PageHeader title={"Templates"} desc={"Crie a personalização do display de seus produtos!"} help={<Helper/>} />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3 }}>
        <StyledDataGrid
          sx={{ maxWidth: '98%' }}
          rows={templates}
          columns={columns}
          getRowId={(row) => row.id || row.name}
          slots={{ toolbar: CustomToolbar }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          onRowDoubleClick={handleRowDoubleClick}
          disableRowSelectionOnClick
          density={isMobile ? "compact" : 'standard'}
          sortingOrder={['desc', 'asc']}
        />
      </Box>


    </Box>
  )
}

export default TemplatesPage