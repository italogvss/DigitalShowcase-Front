
import { Dns, PermMedia, Person, PlaylistAdd, TableChart, Tv } from '@mui/icons-material';
import { Box, Grid2 as Grid, SxProps, Theme, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import InfoTitle from '../Components/InfoTitle';
import { InfoDTO } from '../Model/InfoDTO';
import { useLazyGetSystemInfoQuery } from '../service/SysInfoService';

type Props = {}

const mock: InfoDTO = {
  app: {
    userCount: 0,
    activeUserCunt: 0,
    priceTableCount: 0,
    playlistCount: 0,
    midiaCount: 0,
    imageCount: 0,
    videoCount: 0,
    midiaSize: 0,
    deviceCount: 0,
    onlineDeviceCount: 0
  },
  sys: {
    cpuUsage: 0,
    uptime: 0,
    memoryAvailable: 0,
    memoryUsed: 0,
  }
}

const DashboardPage = (props: Props) => {
  const theme = useTheme();
  const [info, setInfo] = useState(mock)
  const cellStyle: SxProps<Theme> = { bgcolor: theme.palette.grey[300], p: 2, borderRadius: 2 }
  const [trigger, { data: deviceSessions, isLoading, isSuccess, isError, error }] = useLazyGetSystemInfoQuery()

  useEffect(() => {
    trigger().then((res) => {
      if (res.data)
        setInfo(res.data)
    }).catch(() => { })

  }, [])

  return (<>
    {/* <Title text={"Dashbord"} /> */}
    <Box sx={{ p: 4 }}>
      <Typography variant='h2' mb={3}>Informações da Aplicação</Typography>
      <Grid container spacing={2}>
        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="Usuarios" icon={<Person sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Quantidade</strong>: {info.app.userCount}</Typography>
          <Typography variant='body1'><strong>Ativos</strong>: {info.app.activeUserCunt}</Typography>
        </Grid>
        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="Dispositivos" icon={<Tv sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Quantidade</strong>: {info.app.deviceCount}</Typography>
          <Typography variant='body1'><strong>Online</strong>: {info.app.onlineDeviceCount}</Typography>
        </Grid>
        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="Midias" icon={<PermMedia sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Quantidade</strong>: {info.app.midiaCount}</Typography>
          <Typography variant='body1'><strong>Imagens</strong>: {info.app.imageCount}</Typography>
          <Typography variant='body1'><strong>Videos</strong>: {info.app.videoCount}</Typography>
          <Typography variant='body1'><strong>Espaço Utilizado</strong>: {info.app.midiaSize}Mb</Typography>
        </Grid>


        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="Playlists" icon={<PlaylistAdd sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Quantidade</strong>: {info.app.playlistCount}</Typography>
        </Grid>
        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="PriceTables" icon={<TableChart sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Quantidade</strong>: {info.app.priceTableCount}</Typography>
        </Grid>
      </Grid>
      <Typography variant='h2' my={3}>Informações do Sistema</Typography>
      <Grid container spacing={2}>
        <Grid size={4} sx={cellStyle}>
          <InfoTitle title="Servidor" icon={<Dns sx={{ fontSize: "2.5rem" }} />} />
          <Typography variant='body1'><strong>Uso da CPU</strong>: {info.sys.cpuUsage}%</Typography>
          <Typography variant='body1'><strong>Tempo de Uso</strong>: {info.sys.uptime}</Typography>
          <Typography variant='body1'><strong>Memoria Disponivel</strong>: {info.sys.memoryAvailable}Mb</Typography>
          <Typography variant='body1'><strong>Memoria Usada</strong>: {info.sys.memoryUsed}Mb</Typography>
        </Grid>
      </Grid>
    </Box>
  </>)
}

export default DashboardPage