import { ContactSupport, Key, Logout } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Box, createTheme, Divider, IconButton, Menu, MenuItem, ThemeProvider, Toolbar, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { setCredentials } from '../store/reducers/auth';
import { openDrawer } from '../store/reducers/drawer';
import { resetMedia } from '../store/reducers/media';
import { resetPlaylist } from '../store/reducers/playlist';
import { resetPriceTable } from '../store/reducers/priceTable';
import { resetProduct } from '../store/reducers/product';
import { resetTemplate } from '../store/reducers/template';
import { resetUsers } from '../store/reducers/user';
import ModalChangePassword from './Modal/ModalChangePassword';
import ModalSupport from './Modal/ModalSupport';

type Props = {
  open: boolean
}

const UserBar = (props: Props) => {
  const theme = useTheme()
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const auth = useAppSelector(state => state.auth)
  const [openModal, setOpenModal] = useState(false)
  const [openSupport, setOpenSupport] = useState(false)
  const [username, setUsername] = useState<string | undefined>("")
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    if (auth && auth.user) {
      setUsername(auth.user.name)
    }
  }, [auth])

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);

  };

  const barTheme = createTheme(theme, {
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'white', // Cor de fundo do AppBar
            boxShadow: 'none'
          },
        },
      },
    },
  });


  function handlePasswordChange(): void {
    setOpenModal(true)
  }

  function handleLogOut(): void {
    dispatch(resetMedia())
    dispatch(resetPlaylist())
    dispatch(resetPriceTable())
    dispatch(resetProduct())
    dispatch(resetTemplate())
    dispatch(resetUsers())
    dispatch(setCredentials({ user: null, token: null }))
  }

  function handleSupport() {
    setOpenSupport(true)
  }

  return (
    <>
      <ModalChangePassword onClose={() => setOpenModal(false)} open={openModal} />
      <ModalSupport onClose={() => setOpenSupport(false)} open={openSupport} />
      <ThemeProvider theme={barTheme}>
        <AppBar position="static">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'right' }}>
            <IconButton sx={{ display: isMobile ? 'block' : 'none', ml: 2 }} onClick={() => dispatch(openDrawer())}>
              <MenuIcon />
            </IconButton>
            <Typography variant='h3'>{`Seja bem vindo, ${username}`}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ mr: 3, display: 'flex',}}>
            <Typography variant='h3' mr={2} color='black'>Olá, {auth.user?.name ?? "Olá"}</Typography>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={auth.user?.name ?? "Fulano"} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={1} onClick={() => handlePasswordChange()}>
                  <Key sx={{ mr: 1 }} /> <Typography fontWeight={600} sx={{ textAlign: 'center' }}> Mudar Senha</Typography>
                </MenuItem>
                <MenuItem key={2} onClick={() => handleSupport()} >
                  <ContactSupport sx={{ mr: 1 }} /> <Typography fontWeight={600} sx={{ textAlign: 'center' }}>Contatos de Suporte</Typography>
                </MenuItem>
                <MenuItem key={2} onClick={() => handleLogOut()} >
                  <Logout sx={{ mr: 1 }} /> <Typography fontWeight={600} sx={{ textAlign: 'center' }}> Sair</Typography>
                </MenuItem>
              </Menu>
              
            </Box>
          </Toolbar>
        </AppBar>
        <Divider />
      </ThemeProvider>
    </>
  )
}

export default UserBar