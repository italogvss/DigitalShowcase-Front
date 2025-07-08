import { Add } from '@mui/icons-material'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams'
import { useEffect, useState } from 'react'
import { getColumns } from '../../Components/ColumnsDefinitions/UsersColumns'
import { CustomQuickFilter, CustomToolbarContainer, StyledDataGrid } from '../../Components/DataGrid'
import PageHeader from '../../Components/PageHeader'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { User, UserDTO } from '../../Model/UserModel'
import ModalCRUDUser from './ModalCRUDUser'
import { useFindAllByOwnerQuery } from '../../service/UserService'
import { setUsers } from '../../store/reducers/user'
import { toast } from 'react-toastify'
import Helper from './Helper'

type Props = {}

const UsersPage = (props: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //State Hook
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  //Redux Hook
  const { users } = useAppSelector(state => ({ users: state.users }))
  const auth = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch()



  //API Hooks
  const { data, isError } = useFindAllByOwnerQuery(auth?.id?.toString() || '')

  useEffect(() => {
    if (data) {
      const newUsers = toModel(data);
      dispatch(setUsers(newUsers))
    }
  }, [data])

  function toModel(users: UserDTO[]): User[] {
    return users.map(userDTO => ({
      ...userDTO,
      owner: users.find(u => u.id === userDTO.ownerId) as User || null
    }));
  }


  function handleOpen() { setOpen(true) };
  function handleClose() { setOpen(false); };

  const CustomToolbar = () => {
    return (
      <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '50px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex' }}>
          <CustomQuickFilter placeholder="Buscar usuários..." variant={'filled'} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button color="secondary" variant="contained" sx={{ mr: 1 }} onClick={() => { setSelectedUser(undefined); handleOpen() }}>
            <Add sx={{ marginRight: '3px' }} />
            Novo Usuário
          </Button>
        </Box>
      </CustomToolbarContainer>
    )
  }

  function handleRowDoubleClick(params: GridRowParams<User>): void {
    const selected = users.find(u => u.id === params.id as number)
    if ((selected && auth) && selected.id === auth.id) {
      toast.error("Você não pode editar a si mesmo")
    } else {
      setSelectedUser(selected)
      handleOpen()
    }

  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <ModalCRUDUser onClose={handleClose} open={open} user={selectedUser} />
      <PageHeader title={"Usuarios"} desc={"Gerencie seus usuarios!"} help={<Helper/>} />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3 }}>
        <StyledDataGrid
          sx={{ maxWidth: '98%' }}
          rows={users}
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

export default UsersPage