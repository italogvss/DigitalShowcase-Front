/* eslint-disable react-hooks/exhaustive-deps */
import { Block, BorderHorizontal, BorderOuter, BorderVertical, Close, ExpandMore, FormatAlignCenter, FormatAlignLeft, FormatAlignRight, GridOn, HelpOutline, Image, Palette, Save, TableRows, TextFields, ViewColumn } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Slider, Switch, ToggleButton, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StyledToggleButtonGroup } from '../../Components/ButtonGroup';
import { ColorInput } from '../../Components/ColorInput';
import DialogQuiz from '../../Components/Modal/DialogQuiz';
import ModalHeader from '../../Components/Modal/ModalHeader';
import { StyledTextField } from '../../Components/TextInput';
import { Template } from '../../Model/TemplateModel';
import { useFindAllMediaQuery } from '../../service/MediaService';
import { useFindAllPriceTablesQuery } from '../../service/PriceTableService';
import { useCreateTemplateMutation, useUpdateTemplateMutation } from '../../service/TemplateService';
import { useAppSelector } from '../../store/hooks';
import EditHelper from './EditHelper';
import TemplatePreView from './TemplatePreView';
type Props = {}

const initialTemplate: Template = {
  id: undefined,
  userId: undefined,
  name: 'Novo Template',
  rows: 15,
  columns: 2,

  //colors
  color1: '#121c29',
  color2: '#ff7600',
  textColor: '#fff',
  priceColor: '#f98700',
  isTranslucid: false,
  translucid: 1,
  isStriped: false,

  //text
  textSize: 10,
  textPos: 'left',
  pricePos: 'left',
  cipherPos: 'left',
  cipher: 'R$',
  showName: false,

  //image
  haveImage: false,
  imagePos: 3,
  image: undefined,
  haveBackground: false,
  background: undefined,
  imageSize: 3,

  //grid
  haveGrid: false,
  grid: ['all'],
  gridColor: '#000000',
  isDefault: false
}

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

const TemplateEditPage = (props: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id = null } = useParams();

  // Redux hooks
  const user = useAppSelector(state => state.auth.user);
  const priceTable = useAppSelector(state => state.priceTable);
  const templates = useAppSelector(state => state.template);
  const medias = useAppSelector(state => state.media);

  // State hooks
  const [selectedTable, setSelectedTable] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | undefined>();
  const [openDialog, setOpenDialog] = useState(false);
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [isAdmin, setIsAdmin] = useState(false)
  const oldName = useRef("")

  // Media query hook
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // API hooks
  useFindAllPriceTablesQuery(user?.id?.toString() || '', { skip: priceTable.length > 0 });
  useFindAllMediaQuery(user?.id?.toString() || '', { skip: medias.length > 0 });
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();

  //modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (priceTable.length > 0) {
      setSelectedTable(priceTable[0].id ?? undefined)
    }
  }, [])

  useEffect(() => {
    function setExistingTemplate(pageId: string) {
      const selected = templates.find((t => t.id === Number(pageId)))
      console.log(selected)
      if (selected) {
        const image = selected.image
        const background = selected.background
        const selectedImage = image ? medias.find(m => m.id === image.id) : undefined
        const selectedBackground = background ? medias.find(m => m.id === background.id) : undefined
        setTemplate({ ...selected, image: selectedImage, background: selectedBackground })
        oldName.current = selected.name;
      }
    }

    if (id && medias.length > 0 && id !== "novo") {
      setExistingTemplate(id)
    }
  }, [id, medias])

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === "ADMIN")
    }
  }, [user])



  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option) navigate("/templates")
  }
  function validadeTemplate(template: Template) {
    if (template.name.trim() !== "") {
      if (template.name.length > 3) {
        if (id && template.name === oldName.current) {
          return true
        } else {
          if (!templates.some((t) => t.name === template.name)) {
            setError(undefined)
            return true
          } else setError("Nome já existe")
        }
      } else setError("Nome muito curto")
    } else setError("Insira um nome")
    return false
  }

  async function handleSave() {
    if (validadeTemplate(template)) {
      setError(undefined)
      let gridstr: string = ""
      if (Array.isArray(template.grid) && template.grid.every(item => typeof item === 'string'))
        gridstr = template.grid.join(",")
      const userId = user?.id
      if (template.id) {
        await updateTemplate({
          template: {
            ...template,
            grid: gridstr,
            image: template.image?.id,
            background: template.background?.id,
          }
        })
          .unwrap()
          .then(() => {
            toast.success("Template Atualizado")
            navigate("/templates")
          })
          .catch(() => { })
      } else {

        await createTemplate({
          template: {
            ...template,
            userId,
            grid: gridstr,
            image: template.image?.id,
            background: template.background?.id,
            isDefault: isAdmin
          }
        })
          .unwrap()
          .then(() => {
            toast.success("Template criado")
            navigate("/templates")
          })
          .catch(() => { })
      }
    }
  }

  function handleTextPosition(_: any, txtPosition: string | null) {
    if (txtPosition) setTemplate(prev => ({ ...prev, textPos: txtPosition }))
  };
  function handlePricePosition(_: any, pricePosition: string | null) {
    if (pricePosition) setTemplate(prev => ({ ...prev, pricePos: pricePosition }))
  }
  function handleCipher(_: any, cipher: string) {
    if (cipher || '') setTemplate(prev => ({ ...prev, cipher: cipher }))
  }
  function handleGrid(_: any, grid: string[]) {
    setTemplate(prev => ({ ...prev, grid: grid }))
  }

  function handleImage(e: SelectChangeEvent<number>) {
    const image = medias.find(m => m.id === e.target.value)
    if (image) {
      setTemplate(prev => ({ ...prev, image }))
    }
  }
  function handleBackground(e: SelectChangeEvent<number>) {
    const background = medias.find(m => m.id === e.target.value)
    if (background) {
      setTemplate(prev => ({ ...prev, background }))
    }
  }

  function handleHaveBackground(haveBackground: boolean) {
    if (haveBackground) {
      setTemplate(prev => ({ ...prev, isTranslucid: true }))
    }
    setTemplate(prev => ({ ...prev, haveBackground }))
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <DialogQuiz title={"Tem certeza?"}
          text={"Todas as modificações não salvas serão perdidas!"}
          open={openDialog} handleClose={handleCloseDialog}
          variant="warning" />
        <Grid container spacing={2}>
          <Grid size={'grow'} sx={{ mr: isMobile ? 1 : 0, flexDirection: 'column', marginBottom: 2 }}>
            <Typography variant='h1' sx={{ ml: isMobile ? 1 : 4, mt: 3 }}>
              {id !== "novo" ? "Editar Template" : "Novo Template"}
            </Typography>
            <Typography variant='body2' sx={{ ml: isMobile ? 1 : 4, mt: 1 }}>
              Personalize o seu template
            </Typography>
          </Grid>
          <Grid size={isMobile ? 'grow' : 3} sx={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-end', mr: 4 }}>
            <Tooltip title="Ajuda">
              <IconButton aria-label="Ajuda" size='large' sx={{ mb: 1, mr: 1, p: 0.5 }} onClick={handleOpen}>
                <HelpOutline sx={{ color: theme.palette.primary.main }} fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <LoadingButton color="success" variant="contained" sx={{ mb: 1 }} onClick={handleSave}
              loading={isCreating || isUpdating}
              startIcon={<Save sx={{ marginRight: '3px' }} />}
            >Salvar</LoadingButton>
            <Button color="primary" variant="contained" sx={{ mb: 1, ml: 1 }} onClick={() => setOpenDialog(true)}>
              <Close sx={{ marginRight: '3px' }} />
              Cancelar
            </Button>
          </Grid>
        </Grid>
        <Box id="container" sx={{ display: 'flex', mt: 1, mx: 2, height: "100%" }}>
          <Box id="config" sx={{ display: 'flex', flex: 4, mr: 1, p: 2 }} >
            <Grid container width={'100%'} spacing={1} >
              <Grid size={12} display='flex' alignItems='center'><Typography variant='h6'>Nome do Template</Typography></Grid>
              <Grid size={12} >
                <StyledTextField label='Template' value={template.name} type={'text'} onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                  error={!!error} helperText={error ?? undefined}
                />
              </Grid>
              <Grid size={4} display='flex' justifyContent='center'><ViewColumn /></Grid>
              <Grid size={8} display='flex' justifyContent='center'><TableRows /></Grid>

              <Grid size={4} px={1} display='flex' alignItems='center'>
                <Slider value={template.columns} onChange={(e, v) => setTemplate(prev => ({ ...prev, columns: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={1} marks min={1} max={4} />
              </Grid>
              <Grid size={8} px={1} display='flex' alignItems='center'>
                <Slider value={template.rows} onChange={(e, v) => setTemplate(prev => ({ ...prev, rows: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={1} marks min={10} max={25} />
              </Grid>

              <Grid size={12}><Divider /></Grid>

              <Grid size={12} display='flex' alignItems='center'><Palette /><Typography variant='h6'>Cores</Typography></Grid>

              <Grid size={2} display='flex' alignItems='center'><Typography variant='body1'>Primaria</Typography></Grid>
              <Grid size={4} display='flex' alignItems='center'>
                <ColorInput format="hex" value={template.color1} onChange={(e) => setTemplate(prev => ({ ...prev, color1: e }))} />
              </Grid>
              <Grid size={2} display='flex' alignItems='center'><Typography variant='body1'>Secundaria</Typography></Grid>
              <Grid size={4} display='flex' alignItems='center'>
                <ColorInput format="hex" value={template.color2} sx={{ ml: 1 }} onChange={(e) => setTemplate(prev => ({ ...prev, color2: e }))} />
              </Grid>

              <Grid size={2} display='flex' alignItems='center'><Typography variant='body1'>Texto</Typography></Grid>
              <Grid size={4} display='flex' alignItems='center'>
                <ColorInput format="hex" value={template.textColor} onChange={(e) => setTemplate(prev => ({ ...prev, textColor: e }))} />
              </Grid>
              <Grid size={2} display='flex' alignItems='center'><Typography variant='body1'>Preço</Typography></Grid>
              <Grid size={4} display='flex' alignItems='center'>
                <ColorInput format="hex" value={template.priceColor} sx={{ ml: 1 }} onChange={(e) => setTemplate(prev => ({ ...prev, priceColor: e }))} />
              </Grid>

              <Grid size={4} display='flex' alignItems='center'>
                <FormControlLabel control={<Switch checked={template.isTranslucid} onChange={() => setTemplate(prev => ({ ...prev, isTranslucid: !prev.isTranslucid }))} />} label="Transparente" />

              </Grid>
              <Grid size={8} px={1}>
                <Slider value={template.translucid} onChange={(e, v) => setTemplate(prev => ({ ...prev, translucid: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={5} marks min={0} max={100} disabled={!template.isTranslucid} />
              </Grid>
              <Grid size={12} display='flex' alignItems='center'><FormControlLabel control={<Switch checked={template.isStriped} onChange={() => setTemplate(prev => ({ ...prev, isStriped: !prev.isStriped }))} />} label="Listrado" /></Grid>

              <Grid size={12}><Divider /></Grid>

              <Grid size={12} display='flex' alignItems='center'><TextFields /><Typography variant='h6'>Textos</Typography></Grid>
              <Grid size={12} display='flex' alignItems='center'><FormControlLabel control={<Switch checked={template.showName} onChange={() => setTemplate(prev => ({ ...prev, showName: !prev.showName }))} />} label="Mostrar nome da tabela" /></Grid>
              <Grid size={4} display='flex' alignItems='center'><Typography variant='body1'>Tamanho do texto</Typography></Grid>
              <Grid size={8} display='flex' alignItems='center'>
                <Slider value={template.textSize} onChange={(e, v) => setTemplate(prev => ({ ...prev, textSize: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={1} marks min={1} max={15} />
              </Grid>

              <Grid size={6} display='flex' justifyContent='center'><Typography variant='body1'>Posição do texto</Typography></Grid>

              {/* <Grid size={4} display='flex' justifyContent='center'><Typography variant='body1'>Posição do preço</Typography></Grid> */}
              <Grid size={6} display='flex' justifyContent='center'><Typography variant='body1'>Cifrão</Typography></Grid>

              <Grid size={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledToggleButtonGroup size="medium" value={template.textPos} exclusive onChange={handleTextPosition}>
                  <ToggleButton value="left" key="left"><FormatAlignLeft /></ToggleButton>
                  <ToggleButton value="center" key="center"><FormatAlignCenter /></ToggleButton>
                  <ToggleButton value="right" key="right"><FormatAlignRight /></ToggleButton>
                </StyledToggleButtonGroup>
              </Grid>
              {/* <Grid size={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledToggleButtonGroup size="medium" value={template.pricePos} exclusive onChange={handlePricePosition}>
                  <ToggleButton value="left" key="left"><FormatAlignLeft /></ToggleButton>
                  <ToggleButton value="center" key="center"><FormatAlignCenter /></ToggleButton>
                  <ToggleButton value="right" key="right"><FormatAlignRight /></ToggleButton>
                </StyledToggleButtonGroup>
              </Grid> */}
              <Grid size={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <StyledToggleButtonGroup size="medium" value={template.cipher} exclusive onChange={handleCipher}>
                  <ToggleButton value="R$" key="left">R$</ToggleButton>
                  <ToggleButton value="$" key="center">$</ToggleButton>
                  <ToggleButton value=" " key="center"><Block /></ToggleButton>
                </StyledToggleButtonGroup>
              </Grid>

              <Grid size={12} display='flex' justifyContent='center' alignItems='center'>
                <Accordion sx={{ minWidth: '107%' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display='flex' alignItems='center' >
                      <Image /><Typography variant='h6'>Imagem </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container width={'100%'} spacing={1}>
                      <Grid size={6}><FormControlLabel control={<Switch checked={template.haveImage} />} onChange={(e, v) => setTemplate((prev) => ({ ...prev, haveImage: v as boolean }))} label="Imagem lateral" /></Grid>
                      <Grid size={6}>
                        <FormControl size='small' fullWidth><InputLabel >Selecione a imagem</InputLabel>
                          <Select label="Selecione a imagem" MenuProps={{ PaperProps: { style: { maxHeight: "30vh", overflowY: 'auto' } } }}
                            onChange={handleImage}
                            value={template.image?.id || 0}
                            renderValue={(selected) => {
                              const media = medias.find((m) => m.id === selected);
                              return (
                                <Box display="flex" alignItems="center">
                                  <Box
                                    component="img"
                                    src={media?.urlPreview}
                                    sx={{
                                      width: "1.6rem", height: "1.6rem", objectFit: "cover", overflow: "hidden", borderRadius: 1, marginRight: 1
                                    }}
                                  />
                                  <Typography noWrap variant='body1'>{media?.desc}</Typography>
                                </Box>
                              );
                            }}>
                            {medias.map((media) => (
                              <MenuItem value={media.id}>
                                <Box component="img"
                                  src={media.urlPreview}
                                  sx={{ width: "1.8rem", height: "1.8rem", objectFit: "cover", overflow: "hidden", marginRight: 1, borderRadius: 1 }}
                                ></Box><Typography noWrap variant='body1'>{media.desc}</Typography>
                              </MenuItem>
                            ))}

                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={4} display='flex' alignItems='center'><Typography variant='body1'>Tamanho da Imagem</Typography></Grid>
                      <Grid size={8} display='flex' alignItems='center'><Slider value={template.imageSize} onChange={(e, v) => setTemplate(prev => ({ ...prev, imageSize: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={1} marks min={1} max={12} /></Grid>
                      <Grid size={4} display='flex' alignItems='center'><Typography variant='body1'>Corte da Imagem</Typography></Grid>
                      <Grid size={8} display='flex' alignItems='center'><Slider value={template.imagePos} onChange={(e, v) => setTemplate(prev => ({ ...prev, imagePos: v as number }))} valueLabelDisplay="auto" shiftStep={1} color='secondary' step={1} marks min={1} max={20} /></Grid>
                      <Grid size={6}><FormControlLabel control={<Switch checked={template.haveBackground} />} onChange={(e, v) => handleHaveBackground(v)} label="Imagem de fundo" /></Grid>
                      <Grid size={6}>
                        <FormControl size='small' fullWidth><InputLabel >Selecione a imagem</InputLabel>
                          <Select label="Selecione a imagem" MenuProps={{ PaperProps: { style: { maxHeight: "30vh", overflowY: 'auto' } } }}
                            value={template.background?.id || 0}
                            onChange={handleBackground}
                            renderValue={(selected) => {
                              const media = medias.find((m) => m.id === selected);
                              return (
                                <Box display="flex" alignItems="center">
                                  <Box
                                    component="img"
                                    src={media?.urlPreview}
                                    sx={{
                                      width: "1.6rem", height: "1.6rem", objectFit: "cover", overflow: "hidden", borderRadius: 1, marginRight: 1
                                    }}
                                  />
                                  <Typography noWrap variant='body1'>{media?.desc}</Typography>
                                </Box>
                              );
                            }}>
                            {medias.map((media) => {
                              return <MenuItem value={media.id}>
                                <Box component="img"
                                  src={media.urlPreview}
                                  sx={{ width: "1.8rem", height: "1.8rem", objectFit: "cover", overflow: "hidden", marginRight: 1, borderRadius: 1 }}
                                ></Box><Typography noWrap variant='body1'>{media.desc}</Typography>
                              </MenuItem>
                            })}

                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid size={12} display='flex' justifyContent='center' alignItems='center'>
                <Accordion sx={{ minWidth: '107%' }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display='flex' alignItems='center' >
                      <GridOn /><Typography variant='h6'>Grade </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container width={'100%'} spacing={1} display='flex' alignItems='center'>
                      <Grid size={6}  ><FormControlLabel control={<Switch checked={template.haveGrid} onChange={(e, v) => setTemplate(prev => ({ ...prev, haveGrid: !prev.haveGrid }))} />} label="Mostrar grade" /></Grid>
                      <Grid size={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                        <StyledToggleButtonGroup size="medium" value={template.grid} disabled={!template.haveGrid} onChange={handleGrid} color='primary' sx={{ '& .Mui-selected': { backgroundColor: 'primary.main', color: 'white' } }}>
                          <ToggleButton value="outer" key="outer"><BorderOuter /></ToggleButton>
                          <ToggleButton value="horizontal" key="horizontal"><BorderHorizontal /></ToggleButton>
                          <ToggleButton value="vertical" key="vertical"><BorderVertical /></ToggleButton>
                        </StyledToggleButtonGroup>
                      </Grid>
                      <Grid size={6}><Typography variant='body1'>Cor da grade </Typography></Grid>
                      <Grid size={6}><ColorInput format="hex" value={template.gridColor} onChange={(e) => setTemplate(prev => ({ ...prev, gridColor: e }))} /></Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Box>
          <Divider orientation='vertical' />
          <Box id="display" sx={{ display: 'flex', flex: 8, ml: 1, alignItems: 'center', flexDirection: 'column', height: "100%" }}
            borderRadius={3}
          >
            <Grid container width={"100%"}>
              <Grid size={10} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h2'>Pré-visualização</Typography>
              </Grid>
              <Grid size={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: "center" }}>
                <FormControl size='small' fullWidth><InputLabel >Tabelas de preço</InputLabel>
                  <Select label="Selecione a tabela" value={selectedTable} onChange={(e, v) => { setSelectedTable(e.target.value as number) }}>
                    {priceTable.map(pt => (
                      <MenuItem value={pt.id ?? 0}>{pt.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid >
            {selectedTable ?
              <TemplatePreView settings={template} priceTableId={selectedTable} />
              :
              <Box sx={{ height: "80%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>Selecione uma tabela de preço para visualizar o template</Typography>
              </Box>
            }
          </Box>

        </Box>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <ModalHeader title={"Editar Template"} key={0} onClose={handleClose} />
          <EditHelper />
        </Box>
      </Modal>
    </>
  )
}

export default TemplateEditPage