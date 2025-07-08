import { yupResolver } from "@hookform/resolvers/yup";
import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { Box, CircularProgress, Divider, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemText, Modal, OutlinedInput, Typography, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import DialogQuiz from "../../Components/Modal/DialogQuiz";
import ModalHeader from "../../Components/Modal/ModalHeader";
import { PriceTable } from '../../Model/PriceTableModel';
import { useCreatePriceTableMutation, useDeletePriceTableMutation, useFindAllPriceTablesQuery, useUpdatePriceTableMutation } from '../../service/PriceTableService';
import { useAppSelector } from '../../store/hooks';
import { useFindAllPlaylistsQuery } from "../../service/PlaylistService";
import { Playlist } from "../../Model/PlaylistModel";
import { toast } from "react-toastify";
type Props = {
  open: boolean;
  onClose: () => void;
}

type PriceTableValidation = {
  tableName: string
}

const validation = Yup.object<PriceTableValidation>().shape({
  tableName: Yup.string()
    .min(3, "Nome muito curto")
    .required("Insira um nome")
    .test('unique', 'Nome já existe', function (value) {
      const priceTables = this.options.context as PriceTable[];
      return !priceTables.some((table: { name: string }) =>
        table.name.toLowerCase() === value.toLowerCase());
    })
});

const ModalCRUDPriceTable = (props: Props) => {
  const [tableName, setTableName] = useState<string>('')
  const user = useAppSelector(state => state.auth.user);
  const theme = useTheme()
  const priceTables = useAppSelector(state => state.priceTable);
  const playlists = useAppSelector(state => state.playlist);
  const [isEditing, setIsEditing] = useState<null | PriceTable>(null)
  const [createPriceTable,] = useCreatePriceTableMutation();
  const [deletePriceTable, { isLoading: isDeleting }] = useDeletePriceTableMutation();
  const [updatePriceTable, { isLoading: isUpdating }] = useUpdatePriceTableMutation();
  const { register, handleSubmit, formState: { errors }, } = useForm<PriceTableValidation>({ resolver: yupResolver(validation), context: priceTables });
  useFindAllPriceTablesQuery(user?.id?.toString() || '')
  useFindAllPlaylistsQuery(user?.id?.toString() || '')
  const [openDialog, setOpenDialog] = useState(false);
  const idToDelete = useRef<null | number>(null)

  function handleClickOpenDialog() {
    setOpenDialog(true);
  };

  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option && idToDelete.current){
      var result = validadePriceTable(idToDelete.current, playlists)
    if(result.valid){
    await deletePriceTable(idToDelete.current)
    }else{
       toast.warn("Essa tabela esta sendo utilizada nas playlists: " + result.playlistsInUse.join(", ") +"\t Exclua lá primeiro")
    }
  }
  }

  function validadePriceTable(id: number, playlists: Playlist[]): { valid: boolean, playlistsInUse: string[] } {
    const playlistsInUse: string[] = [];
  
    for (const playlist of playlists) {
      for (const item of playlist.items) {
        if (item.type === "priceTable") {
          const priceTable = item.data as PriceTable;
  
          if (priceTable.id === id) {
            playlistsInUse.push(playlist.name);
            break; // Não precisa continuar verificando os itens dessa playlist
          }
        }
      }
    } 
    return {
      valid: playlistsInUse.length === 0,
      playlistsInUse
    };
  }

  function handleInputChange(text: string): void {
    setTableName(text)
  }

  async function handleAdd(form: PriceTableValidation): Promise<void> {
    if (user) {
      await createPriceTable({ priceTable: { id: null, name: form.tableName, userId: user.id } }).unwrap();
      setTableName('');
    }
  }

  async function handleDelete(id: number) {
    idToDelete.current = id
    handleCloseDialog(true)
  }

  async function handleEdit(): Promise<void> {
    if (isEditing && user?.id) {
      await updatePriceTable({ ...isEditing, name: tableName, userId: user.id })
      setIsEditing(null)
      setTableName("")
    }
  }

  function handleClickEdit(table: PriceTable) {
    setIsEditing(table)
    setTableName(table.name)
  }


  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box sx={{
        position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
        bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: '30vw'
      }}>
        <DialogQuiz
          title={"Confirmar exclusão de Tabela?"}
          text={"Essa tabela sera removida de todos os produtos que estiver cadastrada"}
          open={openDialog} handleClose={handleCloseDialog}
          variant="warning" />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
          <ModalHeader title={'Tabelas de Preço'} onClose={() => props.onClose()} />
          <Divider />
          <Box component="form" onSubmit={handleSubmit(handleAdd)}>
            <OutlinedInput notched={false} placeholder='Nome da tabela' type={'text'} fullWidth
              value={tableName}
              required
              autoFocus
              error={!!errors.tableName}

              {...register("tableName")}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value)}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-input': { padding: 1, paddingLeft: 2, }
              }}
              endAdornment={
                <InputAdornment position="end">
                  {isEditing ?
                    <IconButton edge="end" onClick={handleSubmit(handleEdit)} >
                      {isUpdating ? <CircularProgress color="inherit" size={"1.5rem"} /> : <Save />}
                    </IconButton>
                    :
                    <IconButton edge="end" type="submit" >
                      <Box display="flex" alignItems="center" sx={{ backgroundColor: 'secondary.main', borderRadius: 1 }}>
                        <Add />
                      </Box>
                    </IconButton>
                  }
                </InputAdornment>
              }
            />
            {errors.tableName && <Typography variant='subtitle1' color='error'>{errors.tableName.message}</Typography>}
          </Box>
          <Divider />
          <Divider />
          <Box sx={{ borderRadius: '5%', mt: 1, width: '100%', display: "flex", justifyContent: "center" }}>
            {priceTables.length > 0 ?
              <List component="nav" aria-label='main'
                sx={{
                  width: '100%', maxHeight: '25vh', overflowY: 'auto',
                }}>
                {priceTables.map((table) => {
                  return (
                    <ListItem
                      id='listItem'
                      sx={{ '&:hover': { backgroundColor: theme.palette.grey[300], opacity: 1 } }}
                      divider key={table.id} disablePadding secondaryAction={
                        <>
                          <IconButton edge="end" name='button' onClick={(e) => { handleDelete(table.id ?? 0); e.stopPropagation() }} sx={{
                            opacity: 0.4, '&:hover': { color: 'red', opacity: 1 }
                          }}>
                            {(isDeleting && table.id === idToDelete.current) ? <CircularProgress color="inherit" size={"1.5rem"} /> : <Delete />}
                          </IconButton>
                          <IconButton edge="end" name='button' onClick={(e) => { handleClickEdit(table); e.stopPropagation() }} sx={{
                            opacity: 0.4, '&:hover': { color: 'primary.main', opacity: 1 }
                          }}>
                            <Edit />
                          </IconButton>
                        </>
                      }>
                      <ListItemButton >
                        <ListItemText id={'row-' + table.id} primary={table.name} />
                      </ListItemButton>
                    </ListItem>
                  );
                })

                }
              </List>
              :
              <Typography>Não há tabelas de preço. Crie uma!</Typography>
            }
          </Box>
        </Box>
      </Box>

    </Modal>
  )
}

export default ModalCRUDPriceTable