import { AccountCircle, Cast, Dashboard, DisplaySettings, Help, LocalOffer, People } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton, SvgIconTypeMap, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CSSObject, styled, Theme, useTheme } from '@mui/material/styles';
import { ReactElement, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import UserBar from './AppBarUser';
import { useAppSelector } from '../store/hooks';

export const drawerWidth = 320;
type MenuItem ={
  text: string,
  path: string,
  icon: ReactElement,
  role: string[],
}
const allMenuItems: MenuItem[] = [
  { text: 'Produtos', path: '/produtos', icon: <ShoppingCartIcon />, role: ["USER", ] },
  { text: 'Playlists', path: '/playlists', icon: <QueuePlayNextIcon /> , role: ["USER", ]},
  { text: 'Templates', path: '/templates', icon: <DisplaySettings />, role: ["USER","ADMIN" ] },
  { text: 'Displays', path: '/displays', icon: <Cast />, role: ["USER", ] },
  { text: 'Usuarios', path: '/users', icon: <People />, role: ["MANAGER","ADMIN" ] },
   { text: 'Planos', path: '/plans', icon: <LocalOffer />, role: [ ] }, 
  { text: 'Midia', path: '/media', icon: <PermMediaIcon />, role: ["USER", ] },
  { text: 'DashBoard', path: '/dashboard', icon: <Dashboard />, role: ["ADMIN"] },
  /* { text: 'FAQ', path: '/faq', icon: <Help />, role: ["USER", ] }, */
];


const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.primary.main,
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const Drawer = styled(MuiDrawer)(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    border: 'none',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const SList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.primary.main
}));



const UserDrawer = () => {
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useAppSelector(state => state.auth.user);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    if(user)
    switch(user.role){
      case "USER":
        setMenuItems(allMenuItems.filter(item => item.role.includes(user.role)))
        break
      case "MANAGER":
        setMenuItems(allMenuItems.filter(item => item.role.includes(user.role)))
      break
      case "ADMIN":
        setMenuItems(allMenuItems.filter(item => item.role.includes(user.role)))
    }
  }, [user])
  

  useEffect(() => {
    if(location.pathname.includes("edit")){
      setOpen(false)
    }else{
      setOpen(true)
    }
  }, [location])
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: 'flex', }}>
      <Drawer variant={isMobile ? "temporary" : "permanent"} open={open} anchor='left'>
        <DrawerHeader>
          {/* LOGO */}
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <SList>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }} >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  mx: 2,
                  borderRadius: 2,

                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                    '& .MuiListItemText-root': {
                      color: theme.palette.common.white,
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.common.white,
                    },
                  },
                }}

                component={Link}
                to={item.path}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === item.path ? theme.palette.common.white : theme.palette.primary.light
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<Typography variant='h5'>{item.text}</Typography>} sx={{
                  fontSize: "1.2rem",
                  opacity: open ? 1 : 0,
                  color: location.pathname === item.path ? theme.palette.common.white : theme.palette.primary.light,
                }} />
              </ListItemButton>
            </ListItem>
          ))}
        </SList>
        <Divider />

      </Drawer>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <UserBar open={open} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default UserDrawer