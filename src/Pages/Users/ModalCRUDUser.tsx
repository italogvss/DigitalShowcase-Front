import { yupResolver } from "@hookform/resolvers/yup";
import { Delete, ManageAccounts, Person, Save } from "@mui/icons-material";
import LoadingButton from '@mui/lab/LoadingButton';
import { Backdrop, Box, Button, Divider, Fade, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, Switch, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import * as Yup from "yup";
import ModalHeader from '../../Components/Modal/ModalHeader';
import { StyledTextField } from '../../Components/TextInput';
import { UserDTO, User } from '../../Model/UserModel';
import { useRegisterMutation } from "../../service/AuthService";
import { useAppSelector } from "../../store/hooks";
import { useDeleteUserMutation, useUpdateUserMutation } from "../../service/UserService";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User | undefined
}

const userValidationSchema = Yup.object().shape({
  id: Yup.number().optional(),
  name: Yup.string().required("Nome é obrigatório"),
  cpf: Yup.string()
    .optional()
    .test("cpf", "CPF inválido", (value) => {
      if (!value) return true; // Permite valores vazios ou null
      return /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/.test(value);
    }),

  telephone: Yup.string()
    .optional()
    .test("telephone", "Telefone inválido", (value) => {
      if (!value) return true; // Permite valores vazios ou null
      return /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/.test(value);
    }),
  email: Yup.string().optional().email("Email inválido"),
  city: Yup.string().optional(),
  state: Yup.string().optional(),
  address: Yup.string().optional(),
  username: Yup.string()
    .required("Nome de usuário é obrigatório")
    .min(3, "Username deve ter pelo menos 3 caracteres"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  isActive: Yup.boolean().required("O status ativo é obrigatório"),
  validUntil: Yup.string().optional(), // Ajustado para ser opcional conforme o tipo User
  role: Yup.string().required("O papel do usuário é obrigatório"), // Corrigido para ser obrigatório conforme o User type
  ownerId: Yup.number().optional(),
});




const ModalCRUDUser = ({ open, onClose, user }: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isActive, setIsActive] = useState(true);
  const auth = useAppSelector(state => state.auth.user);
  const [register, { isLoading: isCreating }] = useRegisterMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const {
    control,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm<UserDTO>({
    resolver: yupResolver(userValidationSchema),
    defaultValues: { isActive: true }
  });

  useEffect(() => {
    clearErrors()
    if (user) {
      reset({ ...user, password: "********" });
    } else {
      resetValues()
    }
  }, [user, reset]);

  function resetValues() {
    setValue("name", "")
    setValue("cpf", "")
    setValue("telephone", "")
    setValue("email", "")
    setValue("city", "")
    setValue("state", "")
    setValue("address", "")
    setValue("username", "")
    setValue("password", "")
    setValue("isActive", true)
  }
  async function handleRegister(form: UserDTO) {
    if (auth) {
      if (form.validUntil && validadeDate(form.validUntil)) {
        toast.error("A data não pode ser anterior ao dia de hoje.");
        return
      }
      const dto: UserDTO = { ...form, isActive, ownerId: auth.id }
      if (user) {
        await updateUser(dto).unwrap()
          .then(() => {
            toast.success("Usuario atualizado com sucesso")
            onClose()
          }).catch(() => { })
      } else {
        await register(dto).unwrap()
          .then(() => {
            toast.success("Usuario cadastrado com sucesso")
            onClose()
          }).catch(() => { })
      }
    }

  }

  async function handleDelete() {
    if (user && user.id) {
      await deleteUser(user.id).unwrap()
        .then(() => {
          toast.success("Usuario deletado com sucesso")
          onClose()
        })
        .catch((e) => { })
    }
  }

  function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', password);
  };

  function handleTimeChange(event: SelectChangeEvent<number>): void {
    const months = Number(event.target.value);
    const currentDate = dayjs();
    const newDate = currentDate.add(months, 'month');
    setValue("validUntil", newDate.format('YYYY-MM-DD'));
  }

  function handleRoleChange(event: SelectChangeEvent<string>): void {
    const type = event.target.value
    switch (type) {
      case "USER":
        setValue("role", "USER");
        break;
      case "MANAGER":
        setValue("role", "MANAGER");
        break;
      default:
        toast.error("Não existe")
        break;
    }
  }

  function validadeDate(date: string | undefined) {
    if (!date) return true;
    const today = dayjs().startOf('day');
    const selectedDate = dayjs(date).startOf('day');
    return selectedDate.isBefore(today);
  }

  function DataPickerChange(field: ControllerRenderProps<UserDTO, "validUntil">, date: dayjs.Dayjs | null) {
    if (!date) {
      field.onChange(null);
      return;
    }

    const newDate = date.startOf('day'); // Zera as horas para garantir a comparação correta
    const today = dayjs().startOf('day'); // Zera as horas para comparar apenas as datas

    field.onChange(newDate.format('YYYY-MM-DD'));
  }


  return (
    <Modal open={open} onClose={onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}
    >
      <Fade in={open}>
        <Box component="form" onSubmit={handleSubmit(handleRegister)} noValidate sx={{
          position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
          bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: isMobile ? '100vw' : '50vw'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
            <ModalHeader title={user ? 'Editar Usuario' : 'Inserir Usuario'} onClose={() => onClose()} />
            <Divider />
            <Box sx={{ my: 2, display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant='h6' mt={2}>Informações do Usuario</Typography>
              <FormControlLabel control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label={isActive ? "Ativo" : "Inativo"} />
            </Box>
            <Box sx={{ my: 2, display: 'flex' }}>
              <Grid container width={'100%'} spacing={1}>
                <Grid size={6}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Nome"
                        required
                        inputProps={{ style: { textTransform: "lowercase" } }}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="CPF"
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="telephone"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Telefone"
                        error={!!errors.telephone}
                        helperText={errors.telephone?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={3}>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Cidade"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid size={3}>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        size='small'
                        fullWidth
                        error={!!errors.state}
                      >
                        <InputLabel>Estado</InputLabel>
                        <Select
                          {...field}
                          label="Estado"
                        >
                          <MenuItem value="PR">PR</MenuItem>
                          <MenuItem value="RS">RS</MenuItem>
                          <MenuItem value="SC">SC</MenuItem>
                          <MenuItem value="SP">SP</MenuItem>
                          <MenuItem value="MT">MT</MenuItem>
                        </Select>
                        {errors.state && <FormHelperText>{errors.state.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <StyledTextField
                        {...field}
                        label="Endereço"
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Typography variant='h6' mt={2} >Informações de entrada</Typography>
            <Grid container width={'100%'} spacing={1} my={2} >
              <Grid size={6}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      label="Username"
                      required
                      disabled={user ? true : false}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={6} display={'flex'} gap={1}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <StyledTextField
                      {...field}
                      label="Senha"
                      required
                      disabled={user ? true : false}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      fullWidth
                    />
                  )}
                />
                <Button color="secondary" variant="contained"
                  onClick={generatePassword}
                  disabled={user ? true : false}>
                  Gerar
                </Button>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle1">**Anote essas informações antes de cadastrar, não ficarão visiveis novamente</Typography>
              </Grid>
            </Grid>
            <Divider />
            <Typography variant='h6' mt={2}  >Configurações da Conta</Typography>
            <Grid container width={'100%'} spacing={1} my={2}>
              <Grid size={4}>
                <FormControl size='small' fullWidth><InputLabel >Vence daqui...</InputLabel>
                  <Select label="Vence daqui..." onChange={handleTimeChange}>
                    <MenuItem value={1}>1 Mês</MenuItem>
                    <MenuItem value={3}>3 Meses</MenuItem>
                    <MenuItem value={6}>6 Meses</MenuItem>
                    <MenuItem value={12}>1 Ano</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <Controller
                  name="validUntil"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null} // Passando o valor do react-hook-form
                      format="DD-MMM-YYYY"
                      label="Vencimento"
                      onChange={(date) => {
                        DataPickerChange(field, date)
                      }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          fullWidth: true,
                          error: !!errors.validUntil,
                          helperText: errors.validUntil?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={4}>
                <FormControl size='small' fullWidth error={!!errors.role}>
                  <InputLabel>Tipo de Usuario</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Tipo de Usuario"
                        disabled={user ? true : false}
                        onChange={(e) => {
                          field.onChange(e); // Atualiza o valor do Select no `react-hook-form`
                          handleRoleChange(e); // Chama a função adicional, se necessário
                        }}
                      >
                        {auth?.role === "ADMIN" && (
                          <MenuItem value={"MANAGER"}>
                            <ManageAccounts /> Gerenciador
                          </MenuItem>
                        )}
                        <MenuItem value={"USER"}><Person /> Cliente</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.role && <FormHelperText>{errors.role.message}</FormHelperText>}
                </FormControl>

              </Grid>
            </Grid>
            {/* <Typography variant='h6' mt={2}>Informações do Plano</Typography>
            <Box sx={{ my: 2, display: 'flex' }}>
              <Grid container width={'100%'} spacing={1}>
                <Grid size={4}>
                  <FormControl size='small' fullWidth><InputLabel >Plano</InputLabel>
                    <Select label="Plano" >
                      <MenuItem value={10}>Plano Pro</MenuItem>
                      <MenuItem value={20}>Plano Plus</MenuItem>
                      <MenuItem value={30}>Plano Simples</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={4}>
                  <FormControl size='small' fullWidth><InputLabel >Tempo</InputLabel>
                    <Select label="Tempo"  >
                      <MenuItem value={1}>1 Mês</MenuItem>
                      <MenuItem value={3}>3 Meses</MenuItem>
                      <MenuItem value={6}>6 Meses</MenuItem>
                      <MenuItem value={12}>1 Ano</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={4}>
                  <DatePicker label="Vencimento" defaultValue={dayjs()} slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Grid>
                <Grid size={12}>
                  <FormControlLabel control={<Switch />} label="Manter Ativo" />
                </Grid>
              </Grid>
            </Box> */}
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mt: 2, gap: 1 }}>
              <LoadingButton
                loading={isDeleting}
                color="error"
                variant="contained"
                onClick={() => handleDelete()}
                disabled={user ? false : true}
                sx={{ mt: 4, mb: 2, fontSize: '1.1rem' }}
              >
                <Delete />
                Excluir*
              </LoadingButton>
              <LoadingButton
                type="submit"
                loading={isCreating || isUpdating}
                color="success"
                variant="contained"
                sx={{ mt: 4, mb: 2, fontSize: '1.1rem' }}
              >
                <Save />
                {user ? 'Salvar' : 'Cadastrar'}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ModalCRUDUser