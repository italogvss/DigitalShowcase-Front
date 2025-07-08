import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFindByCodeQuery } from '../../service/PlaylistService';
import PlaylistCarousel from './PlaylistCarousel';

const PlaylistViewPage = () => {
  const { code = '' } = useParams<{ code: string }>();
  const isValidCode = /^\d{5}$/.test(code);
  const { data: playlist, isLoading } = useFindByCodeQuery(code, {
    skip: !isValidCode, // Pula a query se o code não for válido
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "90vh", flexDirection: "column" }}>
        <CircularProgress color="secondary" sx={{ fontSize: "80px" }} />
        <Typography variant='h1'>Baixando Playlist</Typography>
      </Box>
    );
  }
  if (!isValidCode) {
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "90vh", flexDirection: "column" }}>
      <Typography variant='h1'>Código inválido. O código deve ter exatamente 5 dígitos.</Typography>
    </Box>
  }
  if (!playlist) {
    return (<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "90vh", flexDirection: "column" }}>
      <Typography variant='h1'>Playlist não encontrada</Typography>
    </Box>)
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", flexDirection: "column" }}>
      <PlaylistCarousel playlist={playlist}/>
    </Box>

  );
};

export default PlaylistViewPage;