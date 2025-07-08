import { Delete, Edit, KeyboardArrowLeft, KeyboardArrowRight, MoreVert, Upload } from '@mui/icons-material'
import { Box, Button, CircularProgress, Divider, FormControl, IconButton, ImageList, ImageListItem, ImageListItemBar, InputLabel, ListItemIcon, Menu, MenuItem, Select, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import DialogQuiz from '../../Components/Modal/DialogQuiz'
import { Media } from '../../Model/MediaModel'
import { useDeleteMediaMutation, useFindAllMediaQuery } from '../../service/MediaService'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setMedia } from '../../store/reducers/media'
import { usePagination } from '../../Util/Pagination'
import PageHeader from '../../Components/PageHeader'
import MediaViewer from './DialogMediaViewer'
import ModalUpdate from './ModalUpdate'
import ModalUpload from './ModalUpload'
import Helper from './Helper'
import { useFindAllPlaylistsQuery } from '../../service/PlaylistService'
import { Playlist } from '../../Model/PlaylistModel'


type Props = {}

const MediasPage = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux hooks
  const user = useAppSelector(state => state.auth.user);
  const { media } = useAppSelector(state => ({ media: state.media }));
  const { playlist } = useAppSelector(state => ({ playlist: state.playlist }));
  const dispatch = useAppDispatch();

  // State hooks
  const [selected, setSelected] = useState<Media | undefined>(undefined);
  const [menuAnchor, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openMenu, setOpenMenu] = useState(menuAnchor ? true : false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [openModalUpload, setOpenModalUpload] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [sort, setSort] = useState<string>("");

  // Pagination hook
  const { paginatedItems, goToNextPage, goToPreviousPage, canGoNext, canGoPrevious } = usePagination<Media>({
    items: media,
    itemsPerPage: 18
  });

  // API hooks
  useFindAllMediaQuery(user?.id?.toString() || '');
  useFindAllPlaylistsQuery(user?.id?.toString() || '')
  const [deleteMedia, { isLoading: isDeleting }] = useDeleteMediaMutation();

  const handleSortChange = (value: string) => {
    setSort(value);
    let sortedMedia: Media[] = [];
    switch (value) {
      case "name":
        sortedMedia = [...media].sort((a, b) => a.desc.localeCompare(b.desc));
        break;
      case "type":
        sortedMedia = [...media].sort((a, b) => a.type.localeCompare(b.type));
        break;
      case "size":
        sortedMedia = [...media].sort((a, b) => a.size - b.size);
        break;
      default:
        sortedMedia = media;
    }
    dispatch(setMedia(sortedMedia));
  };

  function handleClickOpenMenu() {
    setOpenMenu(false)
    setOpenDialog(true);
  };
  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option && selected){ 
      var result = validadeMidia(selected, playlist);
      if(result.valid){
      await deleteMedia(selected.id).unwrap()
      .then(() => { toast.success("Midia excluida"); handleCloseMenu() })
      .catch(() => { })
    }else{
      toast.warn("Essa Midia esta sendo utilizada nas playlists: " + result.playlistsInUse.join(", ") +"\t Exclua lá primeiro")
    }
    }
  }

  function validadeMidia(midia: Media, playlists: Playlist[]): { valid: boolean, playlistsInUse: string[] } {
    const playlistsInUse: string[] = [];
  
    // Percorre todas as playlists
    for (const playlist of playlists) {
      // Verifica se algum item da playlist usa a mídia
      for (const playlistItem of playlist.items) {
        if (playlistItem.type === "image" || playlistItem.type === "video") {
          // Compara se a URL ou ID da mídia é igual à mídia que estamos verificando
          if (playlistItem.data.id === midia.id) {
            playlistsInUse.push(playlist.name); // Adiciona o nome da playlist onde a mídia está sendo usada
            break; // Se encontrar, não precisa continuar verificando os itens dessa playlist
          }
        }
      }
    }  
    // Se a mídia foi encontrada em alguma playlist, retorna false e as playlists em uso
    if (playlistsInUse.length > 0) {
      return { valid: false, playlistsInUse };
    } 
    // Se a mídia não foi encontrada em nenhuma playlist, retorna true
    return { valid: true, playlistsInUse: [] };
  }
  function handleClickImage(item: Media) {
    setSelected(item)
    setOpenViewer(true)
  }
  function handleClick(event: React.MouseEvent<HTMLElement>, item: Media) {
    setSelected(item)
    setAnchorEl(event.currentTarget)
    setOpenMenu(true)
  };

  function handleCloseMenu() {
    setAnchorEl(null);
    setSelected(undefined)
    setOpenMenu(false)
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>

      {selected && (
        <>
          <DialogQuiz title={"Confirmar exclusão da midia?"}
            text={"Essa midia sera removida de todas as playlists que estiver cadastrada"}
            open={openDialog} handleClose={handleCloseDialog}
            variant="warning" />
          <ModalUpdate onClose={() => setOpenModalUpdate(false)} open={openModalUpdate} media={selected} />
          <MediaViewer media={selected} open={openViewer} handleClose={() => { setOpenViewer(false) }} />
        </>
      )}
      <ModalUpload onClose={() => setOpenModalUpload(false)} open={openModalUpload} />
      <PageHeader title={"Fotos e Videos"} desc={"Faça upload das midias que deseja adicionar as suas playlists!"} help={<Helper/>}/>
      <Box sx={{
        display: 'flex', flexDirection: 'column', mx: isMobile ? 0 : 2, mt: 3, p: 1, pb: 2, border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: '10px', boxShadow: theme.customShadows.shadowBox
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="select">Ordenar</InputLabel>
            <Select labelId="select" label='Template' value={sort} onChange={(e) => handleSortChange(e.target.value)} sx={{
              '& .MuiOutlinedInput-input': { padding: 1, paddingLeft: 2, }
            }}>
              <MenuItem value={'name'}>Nome</MenuItem>
              <MenuItem value={'type'}>Tipo</MenuItem>
              <MenuItem value={'size'}>Tamanho</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ gap: 1, display: 'flex' }}>
            <Button color="secondary" variant="contained" disabled={!canGoPrevious} onClick={() => goToPreviousPage()} sx={{ cursor: "pointer" }}><KeyboardArrowLeft /></Button>
            <Button color="secondary" variant="contained" disabled={!canGoNext} onClick={() => goToNextPage()} sx={{ cursor: "pointer" }}><KeyboardArrowRight /></Button>
          </Box>
          <Button color="secondary" variant="contained" onClick={() => setOpenModalUpload(true)}>
            <Upload sx={{ marginRight: '3px' }} /> Importar
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', }}>

          <ImageList sx={{ width: '100%', height: '100%', overflow: "visible" }} cols={isMobile ? 2 : 6} gap={1} rowHeight={250}>
            {paginatedItems.map((item) => (
              <ImageListItem key={item.id} sx={{
                width: 250, borderRadius: '10px', overflow: 'hidden',
                backgroundColor: theme.palette.common.white,
                transition: `${theme.transitions.create(['backgroud-color', 'transform'], { duration: theme.transitions.duration.standard, })}`,
                '&:hover': {
                  transform: "scale(1.05)",
                  backgroundColor: theme.palette.grey[300],
                  zIndex: 1
                },
                zIndex: 0
              }}>
                <ImageListItemBar
                  title={<Box > <Typography noWrap variant='h6' lineHeight={1}>{item.desc}</Typography> </Box>}
                  position="below"
                  sx={{ pl: 1 }}
                  actionIcon={
                    <IconButton onClick={(e) => handleClick(e, item)}
                      id="basic-button"
                      aria-controls={openMenu ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}>
                      <MoreVert fontSize={'small'} color='primary' />
                    </IconButton>
                  }
                />
                <Divider />
                <img

                  onClick={() => handleClickImage(item)}
                  src={`${item.urlPreview}`}
                  alt={item.desc}
                  loading="lazy"
                  style={{
                    padding: theme.spacing(1),
                    borderRadius: 16,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    cursor: "pointer"
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Menu
            id="basic-menu"
            anchorEl={menuAnchor}
            open={openMenu}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={(e) => handleCloseDialog(true)}>
              <ListItemIcon
                sx={{
                  '&:hover': {
                    opacity: 1,
                    color: 'error.main',
                  }
                }}>
                {isDeleting ? <CircularProgress color="error" size={"1.3rem"} /> : <Delete fontSize="small" />}
              </ListItemIcon>
              Deletar
            </MenuItem>
            <MenuItem onClick={() => setOpenModalUpdate(true)}>
              <ListItemIcon sx={{
                '&:hover': {
                  opacity: 1,
                  color: 'primary.main',
                }
              }}>
                <Edit fontSize="small" />
              </ListItemIcon>
              Editar Nome
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}

export default MediasPage