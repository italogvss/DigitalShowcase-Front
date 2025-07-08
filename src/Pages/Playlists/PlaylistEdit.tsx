import { Close, Edit, HelpOutline, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Checkbox, Divider, FormControl, FormControlLabel, IconButton, InputLabel, ListSubheader, MenuItem, Modal, Select, SelectChangeEvent, Switch, SxProps, Theme, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DialogQuiz from '../../Components/Modal/DialogQuiz';
import { StyledTextField } from '../../Components/TextInput';
import { PriceTableLayout } from '../../Model/FullPlaylistModel';
import { Media } from '../../Model/MediaModel';
import { ItemType, Playlist, PlaylistDTO, PlaylistItems } from '../../Model/PlaylistModel';
import { PriceTable } from '../../Model/PriceTableModel';
import { Template } from '../../Model/TemplateModel';
import { useBroadcastPlaylistUpdateMutation } from '../../service/DeviceSessionService';
import { useFindAllMediaQuery } from '../../service/MediaService';
import { toPlaylistDTO, useCreatePlaylistMutation, useUpdatePlaylistMutation } from '../../service/PlaylistService';
import { useCreatePriceTableLayoutMutation, useUpdatePriceTableLayoutsMutation } from '../../service/PriceTableLayoutService';
import { useFindAllPriceTablesQuery } from '../../service/PriceTableService';
import { useFindAllProductsQuery } from '../../service/ProductService';
import { useFindAllDefaultTemplatesQuery, useFindAllTemplatesQuery } from '../../service/TemplateService';
import { useAppSelector } from '../../store/hooks';
import config from '../../Util/config';
import { createPriceTableDisplays } from '../../Util/parseHTML';
import CardMidia from './CardMidia';
import CardTable from './CardTable';
import ModalHeader from '../../Components/Modal/ModalHeader';
import EditHelper from './EditHelper';


type Props = {}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxWidth: 600,
  width: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
};

const MAX_SEC = config.FEATURE.MAX_SECONDS
const MIN_SEC = config.FEATURE.MIN_SECONDS
const MAX_ITEMS = config.FEATURE.MAX_PLAYLIST_ITEMS
const PlaylistEditPage = (props: Props) => {
  const { id = null } = useParams();
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate()

  //Redux Hooks
  const { templates } = useAppSelector(state => ({ templates: state.template }))
  const { medias } = useAppSelector(state => ({ medias: state.media }))
  const { priceTables } = useAppSelector(state => ({ priceTables: state.priceTable }))
  const { playlists } = useAppSelector(state => ({ playlists: state.playlist }))
  const { products } = useAppSelector(state => ({ products: state.product }))
  const user = useAppSelector(state => state.auth.user);

  //State Hooks
  const [idCounter, setIdCounter] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSelectMedia, setOpenSelectMedia] = useState(false)
  const [openSelectTable, setOpenSelectTable] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<number[]>([])
  const [selectedPriceTable, setSelectedPriceTable] = useState<number[]>([])
  const [error, setError] = useState<string | undefined>();
  const [isEditing, setIsEditing] = useState<boolean>(id !== "0")

  //Playlist Hooks
  const [playlistItens, setItems] = useState<PlaylistItems[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined)
  const [playlistName, setPlaylistName] = useState("")
  const [selectedSeconds, setSelectedSeconds] = useState(10)
  const [isTimeFixed, setFixedTime] = useState(false)
  const [isTemplateFixed, setFixedTemplate] = useState(false)
  const [rotation, setRotation] = useState(0)
  //API Hooks
  useFindAllMediaQuery(user?.id?.toString() || '', { skip: medias.length > 0 })
  useFindAllPriceTablesQuery(user?.id?.toString() || '', { skip: priceTables.length > 0 })
  useFindAllTemplatesQuery(user?.id?.toString() || '', { skip: templates.length > 0 })
  useFindAllDefaultTemplatesQuery(undefined, { skip: templates.some(t => t.isDefault) });
  useFindAllProductsQuery(user?.id?.toString() || '', { skip: products.length > 0 })
  const [createPlaylist, { isLoading: isCreating }] = useCreatePlaylistMutation();
  const [createPriceTableLayouts] = useCreatePriceTableLayoutMutation();
  const [updatePlaylist, { isLoading: isUpdating }] = useUpdatePlaylistMutation();
  const [updatePriceTableLayouts,] = useUpdatePriceTableLayoutsMutation();
  const [broadcast] = useBroadcastPlaylistUpdateMutation()

  const card: SxProps<Theme> = {
    width: 210, height: 300, cursor: 'move', border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden',
    backgroundColor: '#fff', flexShrink: 0
  }

   //modal
   const [open, setOpen] = useState(false);

   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);
 
  useEffect(() => {

    function setExistingPlaylis(id: number) {
      const playlist = playlists.find(item => item.id === id)
      if (!playlist) {
        toast.error("Falha ao carregar a playlist")
        navigate("/playlists")
      } else {
        setItems(playlist.items)
        setPlaylistName(playlist.name)
        setFixedTime(playlist.isTimeFixed)
        setFixedTemplate(playlist.isTemplateFixed)
        setRotation(playlist.isVertical)
        if (playlist.isTimeFixed) {
          setSelectedSeconds(playlist.items[0].seconds)
        }

      }
    }
    if (id && id !== "0") {
      setExistingPlaylis(Number(id))
    }
  }, [id])

  function validadePlaylist() {
    if (playlistName.trim().length >= 3) {
      if (playlistItens.length > 0) {
        if (playlistItens.filter(item => item.type === "priceTable").every(item => item.template)) {
          setError(undefined)
          return true
        } else setError("Há tabelas sem template")
      } else setError("Não há items na playlist")
    } else setError("Nome muito curto")
    return false
  }
  async function handleSave() {
    if (!validadePlaylist()) return;

    // Monta a entidade Playlist com seus itens
    const entity: Playlist = {
      id: Number(id),
      isTemplateFixed,
      isTimeFixed,
      isVertical: rotation,
      name: playlistName,
      userId: user?.id || 0,
      items: playlistItens.map((item) => ({
        ...item,
        id: undefined,
        template: isTemplateFixed ? selectedTemplate : item.template,
        seconds: isTimeFixed ? selectedSeconds : item.seconds,
      })),
    };

    const playlist = toPlaylistDTO(entity);

    // Cria a lista de PriceTableLayouts se houver algum item do tipo 'priceTable'
    let priceTableLayouts: PriceTableLayout[] | null = null;
    if (entity.items.some(item => item.type === 'priceTable')) {
      priceTableLayouts = createPriceTableDisplays(entity.items, products);
    }

    try {
      // Salva ou atualiza a playlist e aguarda o retorno com o id salvo
      let savedPlaylist: PlaylistDTO
      if (isEditing) {
        savedPlaylist = await updatePlaylist({ playlist }).unwrap();
        toast.success("Playlist Atualizada");
      } else {
        savedPlaylist = await createPlaylist({ playlist }).unwrap();
        toast.success("Playlist Criada");
      }

      // Se houver PriceTableLayouts, insere o id da playlist em cada um e salva-os
      if (priceTableLayouts && savedPlaylist.id) {
        priceTableLayouts = priceTableLayouts.map(layout => ({
          ...layout,
          id: undefined,
          playlistId: savedPlaylist.id ?? Number(id)
        }));
        if (isEditing) {
          console.log(priceTableLayouts)
          await updatePriceTableLayouts(priceTableLayouts).unwrap();
        } else {
          await createPriceTableLayouts({ priceTableLayouts }).unwrap();
        }
        await broadcast(savedPlaylist.id.toString()).unwrap()
        toast.success("PriceTableLayouts salvos com sucesso");
      }
      navigate("/playlists");
    } catch (error) {
      toast.error("Erro ao salvar playlist e layouts");
    }
  }



  function handleTemplateChange(e: SelectChangeEvent<number>) {
    const value = e.target.value
    const template = templates.find((item) => item.id === value)
    if (template) {
      setSelectedTemplate(template)
      setItems((prev) => prev.map((i) => ({ ...i, template: template })))
    }
  }
  function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option) navigate("/playlists")
  }
  function handleMediaClose() {
    const newMedias = medias.filter(m => selectedMedia.includes(m.id))
    createPlaylistItem(newMedias, "image")
    setSelectedMedia([])
    setOpenSelectMedia(false);
  }
  function handlePriceTableClose() {
    const newPriceTables = priceTables.filter(p => selectedPriceTable.includes(p.id || 0))
    createPlaylistItem(newPriceTables, "priceTable")
    setSelectedPriceTable([])
    setOpenSelectTable(false)
  }
  function createPlaylistItem(data: Media[] | PriceTable[], type: ItemType) {
    const remainingSlots = MAX_ITEMS - playlistItens.length;
    if (remainingSlots <= 0) {
      toast.warn("A Playlist atingiu o máximo de itens!");
      return;
    }
    const itemsToAdd = data.slice(0, remainingSlots);
    if (itemsToAdd.length === 0) {
      toast.warn("Nenhum item foi adicionado porque o limite foi atingido.");
      return;
    }

    if (type === "image") {
      createMediaItem(itemsToAdd as Media[]);
    } else if (type === "priceTable") {
      createPriceTableItem(itemsToAdd as PriceTable[]);
    }

    // Notifica a adição parcial, se aplicável
    if (itemsToAdd.length < data.length) {
      toast.info(
        `Apenas ${itemsToAdd.length} itens foram adicionados para respeitar o limite máximo.`
      );
    }
  }
  function createMediaItem(medias: Media[]) {
    let count = idCounter
    const newItems = medias.map<PlaylistItems>((media, index) => {
      const type = media.type.split("/")[0] as ItemType;
      const order = playlistItens.length + 1 + index
      const sec = type === "video" ? media.sec : MIN_SEC
      count++
      return { data: media, type, seconds: sec, id: count, order }
    });
    setIdCounter(count)
    setItems(prevItems => [...prevItems, ...newItems]);
  }
  function createPriceTableItem(medias: PriceTable[]) {
    let count = idCounter
    const newItems = medias.map<PlaylistItems>((media, index) => {
      const order = playlistItens.length + 1 + index
      count++;
      return { data: media, type: "priceTable", seconds: 5, id: count, order }
    });
    setIdCounter(count)
    setItems(prevItems => [...prevItems, ...newItems]);
  }
  function handleMediaChange(e: SelectChangeEvent<number[]>) {
    const value = e.target.value;
    setSelectedMedia(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  }
  function handlePriceTableChange(e: SelectChangeEvent<number[]>) {
    const value = e.target.value;
    setSelectedPriceTable(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
  }
  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    // Verifica se o destino é válido
    if (!destination) return;
    if (source.index === destination.index) return;

    const reorderedItems = Array.from(playlistItens);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    setItems(updatedItems);
  }
  const handleAddCard = useCallback((n: number, item: PlaylistItems): void => {
    setItems((prevItems) => {
      let newSec = item.seconds + n;
      newSec = newSec > MAX_SEC ? MAX_SEC : newSec;
      return prevItems.map((prev) =>
        prev.id === item.id ? { ...prev, seconds: newSec } : prev
      );
    });
  }, []);
  const handleSubCard = useCallback((n: number, item: PlaylistItems): void => {
    setItems((prevItems) => {
      let newSec = item.seconds - n;
      newSec = newSec < MIN_SEC ? MIN_SEC : newSec;
      return prevItems.map((prev) =>
        prev.id === item.id ? { ...prev, seconds: newSec } : prev
      );
    });
  }, []);
  const removeCard = useCallback((item: PlaylistItems) => {
    setItems((prev) =>
      prev
        .filter((i) => i.id !== item.id)
        .map((item, index) => ({ ...item, order: index + 1 }))
    );
  }, []);
  const handleCardSelectTemplate = useCallback((item: PlaylistItems, template: Template) => {
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, template: template } : i))
  }, [])

  function showPlaylist(): void {
    if(id){
      const playlist = playlists.find(item => item.id === Number(id))
      if(playlist && playlist.code){
      navigate(`/view/${playlist.code}`)
    }else{
      toast.error("Playlist recem criadas não possuem um codigo, salve e tente novamente")
    }
    }
    
  }

  function handleRotacaoChange(event: SelectChangeEvent<number>): void {
    setRotation(Number(event.target.value));
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh', }}>
        <DialogQuiz title={"Tem certeza?"}
          text={"Todas as modificações não salvas serão perdidas!"}
          open={openDialog} handleClose={handleCloseDialog}
          variant="warning" />
        <Grid container spacing={2}>
          <Grid size={'grow'} sx={{ mr: isMobile ? 1 : 0, flexDirection: 'column', marginBottom: 2 }}>
            <Typography variant='h1' sx={{ ml: isMobile ? 1 : 4, mt: 3 }}>
              Nova Playlist {id}
            </Typography>
            <Typography variant='body2' sx={{ ml: isMobile ? 1 : 4, mt: 1 }}>
              Monte sua playlist
            </Typography>
          </Grid>
          <Grid size={isMobile ? 'grow' : 3} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-end', mr: 4 }}>
            <Tooltip title="Ajuda">
              <IconButton aria-label="Ajuda" size='large' sx={{ mb: 1, mr: 1, p: 0.5 }} onClick={handleOpen}>
                <HelpOutline sx={{ color: theme.palette.primary.main }} fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <LoadingButton color="success" variant="contained" sx={{ mb: 1 }} onClick={handleSave} loading={isCreating || isUpdating}>
              {isEditing ? (<Edit sx={{ marginRight: '3px' }} />) : (<Save sx={{ marginRight: '3px' }} />)}Salvar

            </LoadingButton>
            <Button color="primary" variant="contained" sx={{ mb: 1, ml: 1 }} onClick={() => setOpenDialog(true)}>
              <Close sx={{ marginRight: '3px' }} />
              Cancelar
            </Button>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', mt: 3, mx: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 9 }}>
            <Typography variant='h6'>Configurações</Typography>
          </Box>
          <Box sx={{ flex: 3 }}>
            <Typography variant='h6'>Adicionar</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', mt: 1, mx: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 7 }}>
            <StyledTextField fullWidth={true} sx={{ minWidth: 120 }}
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              label='Nome da playlist'
              type='text'
              error={!!error}
              helperText={error ?? undefined}
            />
            <Divider orientation="vertical" flexItem />
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="select">Rotação</InputLabel>
              <Select labelId="select" label='Rotação' 
                onChange={handleRotacaoChange}
                value={rotation}
                sx={{
                  '& .MuiOutlinedInput-input': { padding: 1, paddingLeft: 2, }
                }}>
                <MenuItem value={0}>Sem Rotação</MenuItem>
                <MenuItem value={90}>90º</MenuItem>
                <MenuItem value={270}>270º</MenuItem>
              </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />
            <FormControlLabel control={<Switch checked={isTimeFixed} onChange={(e, c) => setFixedTime(c)} />} label="Tempo fixo" />
            <FormControl sx={{ minWidth: 120 }} size="small">
              <StyledTextField label='Segundos' type="number" disabled={!isTimeFixed} value={selectedSeconds}
                onChange={(e) => setSelectedSeconds(Number(e.target.value))}
                inputProps={{ min: 10, step: 1 }}
              />
            </FormControl>
            <Divider orientation="vertical" flexItem />
            <FormControlLabel control={<Switch checked={isTemplateFixed} onChange={(e, c) => setFixedTemplate(c)} />} label="Template fixo" />
            <FormControl sx={{ minWidth: 120 }} size="small" disabled={!isTemplateFixed}>
              <InputLabel id="select">Template</InputLabel>
              <Select labelId="select" label='Template' disabled={!isTemplateFixed}
                onChange={handleTemplateChange}
                value={selectedTemplate?.id || ""}
                sx={{
                  '& .MuiOutlinedInput-input': { padding: 1, paddingLeft: 2, }
                }}>
                {templates.map((t) => (<MenuItem value={t.id}>{t.name}</MenuItem>))}
              </Select>
            </FormControl>
            <Divider orientation="vertical" flexItem />
          </Box>
          <Box sx={{ flex: 3, display: 'flex', width: "100%" }}>
            <Grid container width={"100%"} spacing={1} >
              <Grid size={6}>
                <FormControl size='small' fullWidth><InputLabel >Imagem ou Video</InputLabel>
                  <Select label="Selecione a imagem" MenuProps={{ PaperProps: { style: { maxHeight: "30vh", maxWidth: "20vw", overflowY: 'auto' } } }}
                    open={openSelectMedia}
                    onClose={() => { setSelectedMedia([]); setOpenSelectMedia(false) }}
                    onOpen={() => setOpenSelectMedia(true)}
                    onChange={handleMediaChange} value={selectedMedia} multiple
                    renderValue={(selected) =>
                    (<Box display="flex" alignItems="center">
                      {selected.map((id) => (
                        <Box
                          component="img"
                          src={medias.find(m => m.id === id)?.urlPreview}
                          sx={{ width: "1.6rem", height: "1.6rem", objectFit: "cover", overflow: "hidden", borderRadius: 1, marginRight: 0.5 }}
                        />))}
                    </Box>)}>
                    <ListSubheader>
                      <Button fullWidth color="secondary" disabled={!selectedMedia.length} variant='contained'
                        onClick={handleMediaClose}>
                        Adicionar selecionados
                      </Button>
                    </ListSubheader>
                    {medias.map((media) => (
                      <MenuItem key={media.id} value={media.id}>
                        <Box component="img"
                          src={media.urlPreview}
                          sx={{ width: "1.8rem", height: "1.8rem", objectFit: "cover", overflow: "hidden", marginRight: 1, borderRadius: 1 }}
                        ></Box>
                        <Checkbox checked={selectedMedia.includes(media.id)} />
                        <Typography noWrap variant='body1'>{media.desc}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={6}>
                <FormControl size='small' fullWidth><InputLabel >Tabelas de Preço</InputLabel>
                  <Select label="Tabelas de Preço" MenuProps={{ PaperProps: { style: { maxHeight: "30vh", overflowY: 'auto' } } }}
                    open={openSelectTable}
                    onClose={() => { setSelectedPriceTable([]); setOpenSelectTable(false) }}
                    onChange={handlePriceTableChange}
                    onOpen={() => setOpenSelectTable(true)}
                    value={selectedPriceTable}
                    multiple
                    renderValue={(selected) =>
                      (priceTables.filter(p => selected.includes(p.id || 0)).map(p => p.name).join(","))}>
                    <ListSubheader>
                      <Button fullWidth color="secondary" disabled={!selectedPriceTable.length} variant='contained'
                        onClick={handlePriceTableClose}>
                        Adicionar selecionados
                      </Button>
                    </ListSubheader>
                    {priceTables.map((pt) => (
                      <MenuItem key={pt.id} value={pt.id || 0}>
                        <Checkbox checked={selectedPriceTable.includes(pt.id || 0)} />
                        <Typography noWrap variant='body1'>{pt.name}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

          </Box>
        </Box>
        <Box id='container' sx={{ display: 'flex', padding: 4 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal" >
              {(provided) => (
                <Box
                  id='horizontal-list'
                  sx={{ display: 'flex', flexDirection: 'row', gap: 1, overflowX: 'scroll', width: '80vw', pb: 3 }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}>
                  {playlistItens.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id?.toString() || ""} index={index}>
                      {(provided) => (
                        <Box key={item.id} id={`cardContainer-${item.id}`} sx={card} ref={provided.innerRef} {...provided.draggableProps}{...provided.dragHandleProps}>
                          {item.type === 'priceTable' ? (
                            <CardTable item={item} templates={templates}
                              setTemplate={handleCardSelectTemplate}
                              add={handleAddCard} sub={handleSubCard} removeItem={removeCard}
                              isFixed={isTimeFixed}
                              isFixedTemplate={isTemplateFixed}
                            />
                          ) : (
                            <CardMidia item={item} add={handleAddCard} sub={handleSubCard} removeItem={removeCard} isFixed={isTimeFixed} />
                          )}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <ModalHeader title={"Editar Playlist"} key={0} onClose={handleClose} />
          <EditHelper />
        </Box>
      </Modal>
    </>
  )
}

export default React.memo(PlaylistEditPage)