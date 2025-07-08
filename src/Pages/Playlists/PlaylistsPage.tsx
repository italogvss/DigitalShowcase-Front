import { Add, Sync } from '@mui/icons-material'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { GridRowParams } from '@mui/x-data-grid/models/params/gridRowParams'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getColumns } from '../../Components/ColumnsDefinitions/PlaylistColumns'
import { CustomQuickFilter, CustomToolbarContainer, StyledDataGrid } from '../../Components/DataGrid'
import DialogQuiz from '../../Components/Modal/DialogQuiz'
import PageHeader from '../../Components/PageHeader'
import { Playlist } from '../../Model/PlaylistModel'
import { useFindAllMediaQuery } from '../../service/MediaService'
import { useDeletePlaylistMutation, useFindAllPlaylistsQuery } from '../../service/PlaylistService'
import { useFindAllPriceTablesQuery } from '../../service/PriceTableService'
import { useFindAllDefaultTemplatesQuery, useFindAllTemplatesQuery } from '../../service/TemplateService'
import { useAppSelector } from '../../store/hooks'
import { PriceTableLayout } from '../../Model/FullPlaylistModel'
import { createPriceTableDisplays } from '../../Util/parseHTML'
import { useFindAllProductsQuery } from '../../service/ProductService'
import { useUpdatePriceTableLayoutsMutation } from '../../service/PriceTableLayoutService'
import { useBroadcastUserUpdateMutation } from '../../service/DeviceSessionService'
import Helper from './Helper'


type Props = {}

const PlaylistsPage = (props: Props) => {
  const theme = useTheme()
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //Redux Hooks
  const user = useAppSelector(state => state.auth.user);
  const playlists = useAppSelector(state => state.playlist)
  const medias = useAppSelector(state => state.media)
  const priceTables = useAppSelector(state => state.priceTable)
  const templates = useAppSelector(state => state.template)
  const products = useAppSelector(state => state.product)

  //State hooks
  const [openDialog, setOpenDialog] = useState(false);
  //Refs
  const selectedId = useRef<number>(undefined)

  //Não mudar ordem, ao buscar playlist, precisa dos outros dados
  const [deletePlaylist, { isLoading: isDeleting }] = useDeletePlaylistMutation()
  useFindAllMediaQuery(user?.id?.toString() || '', { skip: medias.length > 0 })
  useFindAllPriceTablesQuery(user?.id?.toString() || '', { skip: priceTables.length > 0 })
  useFindAllTemplatesQuery(user?.id?.toString() || '', { skip: templates.length > 0 })
  useFindAllDefaultTemplatesQuery(undefined,{ skip: templates.some(t => t.isDefault) });
  useFindAllPlaylistsQuery(user?.id?.toString() || '')
  useFindAllProductsQuery(user?.id?.toString() || '', { skip: products.length > 0 })
  const [updatePriceTableLayouts,] = useUpdatePriceTableLayoutsMutation();
  const [broadcast] = useBroadcastUserUpdateMutation()

  const handleAdd = useCallback(() => {
    navigate('/playlists/edit/0')
  }, [navigate]);

  async function handleUpdateTV(playlists: Playlist[]) {
    if (playlists && playlists.length > 0) {
      for (const playlist of playlists) {
        let priceTableLayouts = null;
  
        // Cria uma nova lista de itens com o template atualizado
        const updatedItems = playlist.items.map(item => {
          if (item.type === 'priceTable' && item.template) {
            // Busca o template atualizado pelo mesmo id
            const updatedTemplate = templates.find(t => t.id === item.template?.id);
            return updatedTemplate ? { ...item, template: updatedTemplate } : item;
          }
          return item;
        });
  
        // Verifica se há algum item do tipo priceTable para gerar os layouts
        if (updatedItems.some(item => item.type === 'priceTable')) {
          console.log("Products", products)
          priceTableLayouts = createPriceTableDisplays(updatedItems, products);
        }
  
        // Realiza as transformações para a API e atualiza os layouts
        if (priceTableLayouts) {
          priceTableLayouts = priceTableLayouts.map(layout => ({
            ...layout,
            id: undefined,
            playlistId: playlist.id ?? 0
          }));
          try {
            await updatePriceTableLayouts(priceTableLayouts).unwrap();
          } catch (error) {
            // Trate o erro conforme necessário
          }
        }
      }
      if (user?.id)
        await broadcast(user.id.toString()).unwrap()
          .then(() => { toast.success("Playlists Atualizadas"); })
          .catch(() => { toast.error("Falha na atualização"); });
    }
  }

  const handleEdit = useCallback((params: GridRowParams<Playlist>) => {
    navigate(`/playlists/edit/${params.id as number}`)
  }, [navigate]);

  const handleViewPlaylist = useCallback((params: GridRowParams<Playlist>) => {
    navigate(`/view/${params.row.code}`)
  }, [navigate]);

  const handleDelete = useCallback((params: GridRowParams<Playlist>) => {
    selectedId.current = params.id as number
    setOpenDialog(true)
  }, []);

  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option && selectedId.current) {
      await deletePlaylist(selectedId.current).unwrap()
        .then(() => toast.success("Playlist Excluida")).catch(()=>{})
    }
  }
  const columns = useMemo(() => {
    return getColumns(handleEdit, handleDelete, handleViewPlaylist)[isMobile ? 1 : 0];
  }, [handleEdit, handleDelete, isMobile]);

  const CustomToolbar = memo(({ handleAdd, isMobile }: { handleAdd: () => void; isMobile: boolean }) => {
    return (
      <CustomToolbarContainer
        sx={{
          height: isMobile ? 'auto' : '50px',
          flexDirection: isMobile ? 'column' : 'row',
          display: 'flex',
          p: 1,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <CustomQuickFilter placeholder="Buscar itens..." variant="filled" />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="primary" variant="contained" sx={{ mb: 1 }} onClick={()=>handleUpdateTV(playlists)}>
            <Sync sx={{ marginRight: '3px' }} />
            Atualizar TVs
          </Button>
          <Button color="secondary" variant="contained" sx={{ mb: 1 }} onClick={handleAdd}>
            <Add sx={{ marginRight: '3px' }} />
            Nova Playlist
          </Button>
        </Box>
      </CustomToolbarContainer>
    );
  });

  function handleRowDoubleClick(params: GridRowParams<any>): void {
    navigate('edit/' + params.id)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <DialogQuiz title={"Confirmar exclusão do Playlist?"}
        text={"Esta playlist sera excluida permanentemente"}
        open={openDialog} handleClose={handleCloseDialog}
        variant="warning" />
      <PageHeader title={"Playlists"} desc={"Crie e edite suas playlists!"} help={<Helper/>} />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3 }}>
        <StyledDataGrid
          columnHeaderHeight={50}
          sx={{ maxWidth: '98%' }}
          rows={playlists}
          columns={columns}
          getRowId={(row) => row.id || row.name}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: () => <CustomToolbar handleAdd={handleAdd} isMobile={isMobile} /> }}
          disableRowSelectionOnClick
          onRowDoubleClick={handleRowDoubleClick}
        /* onRowSelectionModelChange={handleSelectionChange}
        
        density={isMobile ? "compact" : 'standard'}
        sortingOrder={['desc', 'asc']}
        
      /* onCellEditStart={handleCellEditStart} */
        />
      </Box>
    </Box>
  )
}

export default PlaylistsPage