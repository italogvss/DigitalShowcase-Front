import { Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Backdrop, Box, Divider, Fade, IconButton, List, ListItem, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { Media } from '../../Model/MediaModel';
import { useCreateMediaMutation } from '../../service/MediaService';
import { useAppSelector } from '../../store/hooks';
import { config } from '../../Util/config';
import ModalHeader from '../../Components/Modal/ModalHeader';
import { StyledTextField } from '../../Components/TextInput';

type Props = {
  open: boolean;
  onClose: () => void;
}

const MAX_ITENS = config.FEATURE.MAX_FILES
const MAX_FILE_SIZE = config.FEATURE.MAX_FILE_SIZE
const MAX_NAME_LENGHT = config.FEATURE.MAX_STRING_LENGHT
const MIN_NAME_LENGHT = config.FEATURE.MIN_STRING_LENGHT
const ModalUpload = (props: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const user = useAppSelector(state => state.auth.user)
  const [createMedia, { isLoading: isCreating }] = useCreateMediaMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  function validadeFileNames(names: string[]){
    let validade = true
    names.forEach((name, index)=>{
      if(name.length > MAX_NAME_LENGHT){
        toast.warn(`O ${index+1}º arquivo tem um nome muito grande`)
        validade = false
      }
      if(name.length < MIN_NAME_LENGHT){
        toast.warn(`O ${index+1}º arquivo tem um nome muito curto`)
        validade = false
      }
    })
    return validade
  }

  async function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            resolve(video.duration);
        };

        video.onerror = () => {
            reject(new Error("Não foi possível carregar o vídeo."));
        };

        video.src = URL.createObjectURL(file);
    });
}

  async function handleSave() {
    if (user) {
      if(validadeFileNames(fileNames)){
      const userId = user.id;
      const medias: Media[] = []
      let error = false
      for (let i = 0; i < selectedFiles.length; i++) {
        let sec = 0
        // os segundos não são utilizados em nada
        /* if(selectedFiles[i].type.startsWith("video")){ 
        sec = await getVideoDuration(selectedFiles[i])
      } */
        await createMedia({ userId, desc: fileNames[i], type: selectedFiles[i].type, data: selectedFiles[i], sec: Math.round(sec).toString()}).unwrap()
          .then((res) => medias.push(res))
          // eslint-disable-next-line no-loop-func
          .catch(() => { error = true; toast.error(`Não foi possivel fazer upload de ${fileNames[i]}`) })
      }
      if (!error) {
        toast.success("Upload feito com sucesso")
      }
      setSelectedFiles([])
      setFileNames([])
      props.onClose()
    }
  }
  }
  function onDrop(acceptedFiles: File[]) {
    const maxFileSizeBytes = MAX_FILE_SIZE * 1024 * 1024;
  
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxFileSizeBytes) {
        toast.warn(`O arquivo "${file.name}" excede o tamanho máximo permitido de ${MAX_FILE_SIZE} MB`);
        return false;
      }
      return true;
    });
  
    const newFiles = validFiles.filter(file => !fileNames.includes(file.name));
  
    if (selectedFiles.length + newFiles.length > MAX_ITENS) {
      toast.warn(`Só é possível fazer upload de ${MAX_ITENS} arquivos por vez`);
    } else {
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      setFileNames(prevNames => [...prevNames, ...newFiles.map(file => file.name)]);
    }
  }

  function handleNameChange(index: number, newName: string) {
    setFileNames(prevNames => {
      const updatedNames = [...prevNames];
      updatedNames[index] = newName.replace(/\.[^/.]+$/, "");
      return updatedNames;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4']
    },
    onDrop,
    multiple: true,
  });

  return (
    <Modal open={props.open} onClose={() => { setSelectedFiles([]); setFileNames([]); props.onClose(); }} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}
    >
      <Fade in={props.open}>
        <Box sx={{
          position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
          bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: isMobile ? '100vw' : '30vw'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
            <ModalHeader title={'Importar Midia'} onClose={() => { setSelectedFiles([]); setFileNames([]); props.onClose(); }} />
            <Divider />
            <Box
              {...getRootProps()}
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px dashed #aaa',
                textAlign: 'center',
                height: '25vh',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography>Solte os arquivos aqui...</Typography>
              ) : (
                <Box display={'flex'} flexDirection={'column'}><Typography variant="h6" sx={{ mt: 2 }}>
                  Clique ou arraste fotos e videos aqui.
                </Typography>
                  <Typography variant="body1" lineHeight={2}>
                    Aceita .png .jpeg .mp4
                  </Typography></Box>
              )}
            </Box>
            {selectedFiles.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">
                  Altere o nome se desejar
                </Typography>
                <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: '300px', overflow: "scroll" }}>
                  {selectedFiles.map((file, index) => (
                    <ListItem
                      sx={{ padding: '3px' }} key={file.name}
                      secondaryAction={
                        <IconButton onClick={() => {
                          setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
                          setFileNames(prevNames => prevNames.filter((_, i) => i !== index));
                        }}>
                          <Delete sx={{ color: 'gray', '&:hover': { color: 'red' } }} />
                        </IconButton>}>
                      <StyledTextField
                        value={fileNames[index].replace(/\.[^/.]+$/, "")}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        sx={{ marginRight: '10px' }}
                      />
                    </ListItem>))}
                </List>
              </Box>
            )}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right', mt: 2 }}>
              <Typography variant="body1" lineHeight={2}>
                Tamanho maximo: {MAX_FILE_SIZE}MB
              </Typography>
              <LoadingButton color="success" variant="contained" onClick={() => handleSave()} loading={isCreating}
                disabled={!selectedFiles.length}>
                Salvar
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ModalUpload;