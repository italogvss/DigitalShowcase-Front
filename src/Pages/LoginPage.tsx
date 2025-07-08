import { yupResolver } from "@hookform/resolvers/yup";
import { Key, Person } from '@mui/icons-material';
import { LoadingButton } from "@mui/lab";
import { Box, InputAdornment, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { LoginRequest, useLoginMutation } from "../service/AuthService";
import { useAppSelector } from "../store/hooks";

type Props = {};


const goTo = ["/playlists", "/users"]

const validation = Yup.object<LoginRequest>().shape({
  username: Yup.string().min(3, "Username invalido").required("É preciso inserir um nome de usuário"),
  password: Yup.string().min(5, "Senha invalida").required("É preciso inserir uma senha"),
});

const LoginPage = (props: Props) => {
  const theme = useTheme()
  const auth = useAppSelector(state => state.auth.user);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, } = useForm<LoginRequest>({ resolver: yupResolver(validation) });

  const [login, { isLoading }] = useLoginMutation()
  async function handleLogin(form: LoginRequest) {
    await login(form).then((res) => {
      const data = res.data
      if(data && auth?.token && (data.role === "ADMIN" || data.role === "MANAGER")){
        navigate(goTo[1])
      }else{
        navigate(goTo[0])
      }
    })
  };

  return (
    <Grid container spacing={1} sx={{ mx: 2 }}>
      {!isMobile && <Grid size={9}>
        <Box
          sx={{
            marginTop: '25vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h1">
            Thiago Midia
          </Typography>
          <Typography variant="body1">
            
          </Typography>
        </Box>
      </Grid>}
      <Grid size={isMobile ? 'grow' : 3}  >
        <Box
          sx={{
            mx: 2,
            marginTop: '20vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
          }}
        >
          <Typography variant="h5">
            Olá seja bem vindo
          </Typography>
          <Typography variant="body2">
            Entre com seu login e senha
          </Typography>
          <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'left', }}>
            <Typography variant="subtitle1">Nome do usuario</Typography>
            <TextField
              required
              fullWidth
              id="username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiInputBase-root': {
                  borderColor: errors.username ? 'red' : 'inherit',
                },
              }}
            />
            <Typography>Senha</Typography>
            <TextField
              required
              fullWidth
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                '& .MuiInputBase-root': {
                  borderColor: errors.password ? 'red' : 'inherit',
                },
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoading}
              color="secondary"
              variant="contained"

              sx={{ mt: 4, mb: 2, fontSize: '1.1rem', width: '100%' }}
            >
              Entrar
            </LoadingButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;