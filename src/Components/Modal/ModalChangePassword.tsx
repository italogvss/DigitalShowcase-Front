import { yupResolver } from "@hookform/resolvers/yup";
import { Backdrop, Box, Button, Divider, Fade, Modal } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { PasswordChangeRequest } from '../../Model/PasswordChangeModal';
import { useUpdatePasswordMutation } from '../../service/UserService';
import { useAppSelector } from '../../store/hooks';
import { StyledTextField } from '../TextInput';
import ModalHeader from './ModalHeader';
import { LoadingButton } from "@mui/lab";

type PasswordChange = {
  current: string;
  newPassword1: string;
  newPassword2: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const validationSchema = Yup.object<PasswordChange>().shape({
  current: Yup.string().required("A senha atual é obrigatória"),
  newPassword1: Yup.string()
    .min(6, "A nova senha deve ter pelo menos 6 caracteres")
    .required("A nova senha é obrigatória"),
  newPassword2: Yup.string()
    .oneOf([Yup.ref("newPassword1")], "As senhas não coincidem")
    .required("É necessário confirmar a nova senha"),
});

const ModalChangePassword = (props: Props) => {
  const [updatePassword, { isLoading: isUpdating }] = useUpdatePasswordMutation()
  const auth = useAppSelector(state => state.auth)
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChange>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (props.open) {
      reset();
    }
  }, [props.open, reset]);

  async function onSubmit(data: PasswordChange) {
    if (!(auth && auth.user)) return
    const request: PasswordChangeRequest = { newPassword: data.newPassword1, userId: auth.user?.id }
    await updatePassword(request).unwrap()
      .then(() => {
        toast.success("Senha atualizada com sucesso")
        props.onClose();
      })
      .catch(() => { })

  };

  return (
    <Modal open={props.open} onClose={props.onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}>
      <Fade in={props.open}>
        <Box sx={{
          position: "absolute" as "absolute", top: "50vh", left: "50vw", transform: "translate(-50%, -50%)",
          bgcolor: "white", borderRadius: "15px", boxShadow: 10, p: 4, width: "20vw"
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "left", alignItems: "left" }}>
            <ModalHeader title="Atualizar senha" onClose={props.onClose} />
            <Divider />
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ my: 2, display: "flex" }}>
                <Grid container width="100%" spacing={1}>
                  <Grid size={12}>
                    <Controller
                      name="current"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          label="Senha Atual"
                          type="password"
                          {...field}
                          error={!!errors.current}
                          helperText={errors.current?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="newPassword1"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          label="Nova senha"
                          type="password"
                          {...field}
                          error={!!errors.newPassword1}
                          helperText={errors.newPassword1?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={12}>
                    <Controller
                      name="newPassword2"
                      control={control}
                      render={({ field }) => (
                        <StyledTextField
                          label="Digite Novamente"
                          type="password"
                          {...field}
                          error={!!errors.newPassword2}
                          helperText={errors.newPassword2?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "right", alignItems: "right", mt: 2 }}>
                <LoadingButton color="success" variant="contained" type="submit" loading={isUpdating}>
                  Mudar Senha
                </LoadingButton>
              </Box>
            </form>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalChangePassword;

