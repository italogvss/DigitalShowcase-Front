import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from '@mui/lab';
import { Backdrop, Box, Divider, Fade, Modal, useMediaQuery, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { Media } from '../../Model/MediaModel';
import { useUpdateMediaMutation } from '../../service/MediaService';
import ModalHeader from "../../Components/Modal/ModalHeader";
import { StyledTextField } from "../../Components/TextInput";

type Props = {
  open: boolean;
  onClose: () => void;
  media?: Media;
}

type MediaValidation = {
  newName: string
}

const validation = Yup.object<MediaValidation>().shape({
  newName: Yup.string()
    .min(3, "Nome muito curto")
    .required("Insira um nome")
});

const ModalUpdate: React.FC<Props> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [updateMedia, { isLoading: isUpdating }] = useUpdateMediaMutation();
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<MediaValidation>({
    resolver: yupResolver(validation),
    defaultValues: { newName: props.media?.desc || "Novo nome" }
  });

  useEffect(() => {
    if (props.media) {
      setValue("newName", props.media.desc);
    }
  }, [props.media, setValue]);

  async function handleSave(data: MediaValidation) {
    if (props.media) {
      await updateMedia({ ...props.media, desc: data.newName }).unwrap()
        .then(() => {
          toast.success("Media atualizada");
        })
        .catch(() => { });
      props.onClose();
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}
    >
      <Fade in={props.open}>
        <Box sx={{
          position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
          bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: isMobile ? '100vw' : '30vw'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
            <ModalHeader title={'Novo Nome'} onClose={props.onClose} />
            <Divider />
            <Box sx={{ my: 2, display: 'flex' }}>
              <Controller
                name="newName"
                control={control}
                render={({ field }) => (
                  <StyledTextField
                    label={"Novo nome"}
                    {...field}
                    error={!!errors.newName}
                    helperText={errors.newName?.message}
                  />
                )}
              />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mt: 2 }}>
              <LoadingButton color="success" variant="contained" onClick={handleSubmit(handleSave)} loading={isUpdating}>
                Salvar
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalUpdate