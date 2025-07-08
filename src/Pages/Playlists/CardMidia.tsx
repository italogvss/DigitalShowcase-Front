import { Add, Close, Remove } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Divider, IconButton, SxProps, Theme, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { Media } from "../../Model/MediaModel";
import { PlaylistItems } from "../../Model/PlaylistModel";

type Props = {
  item: PlaylistItems
  add: (n: number, item: PlaylistItems) => void
  sub: (n: number, item: PlaylistItems) => void
  removeItem: (item: PlaylistItems) => void
  isFixed: boolean
}

const CardMidia = React.memo((props: Props) => {
  const buttonTheme: SxProps<Theme> = {
    color: '#fff',
    backgroundColor: 'secondary.main',
    "&.Mui-disabled": { backgroundColor: "secondary.light" },
    borderRadius: 2,
    "&:hover": { backgroundColor: 'secondary.light' }
  }

  function getType(str: string) {
    const desc = str === "image" ? "Imagem" : str === "video" ? "Video" : "Tabela"
    return desc;
  }
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <Grid container>
        <Grid size={2} sx={{ backgroundColor: 'primary.main', color: '#fff', display: 'flex', justifyContent: 'center', borderRadius: '0px 0px 7px 0px' }}>
          <Typography variant="h6">{`${props.item.order}º`}</Typography>
        </Grid>
        <Grid size={8} sx={{ display: 'flex', justifyContent: 'center', }}>
          <Typography variant="h6">{`${getType(props.item.type)}`}</Typography>
        </Grid>
        <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: "center" }} size={2}>
          <IconButton sx={{ p: 0, cursor: "pointer", "&:hover": { color: "error.main" } }} onClick={() => props.removeItem(props.item)}>
            <Close />
          </IconButton>
        </Grid>
      </Grid>
      <Box><Divider /></Box>
      <Box sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 5, overflow: 'hidden',
        backgroundColor: 'white', borderRadius: 2, m: 1
      }}>
        <img src={`${(props.item.data as Media).urlPreview}`} alt={''} loading="lazy"
          style={{ overflow: 'hidden', width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, pb: 0.5, flexDirection: 'column' }}>
        <Typography variant='body1'>Segundos</Typography>
        <ButtonGroup size="small" color='secondary' fullWidth
          disabled={props.item.type === "video" || props.isFixed}
          variant="contained"
          sx={{
            boxShadow: "none",
            display: 'flex', justifyContent: 'center',
            '& .MuiButtonGroup-grouped': {
              p: 0,
              fontSize: '1.05rem',
              width: 30
            }
          }}>
          <Button sx={buttonTheme} onClick={() => props.add(5, props.item)} key="add">+5</Button>,
          <Button sx={buttonTheme} onClick={() => props.add(1, props.item)} key="add"><Add /></Button>,
          <Button sx={{ backgroundColor: '#fff', color: "primary.main" }}>{props.isFixed ? "" : props.item.seconds}</Button>,
          <Button sx={buttonTheme} onClick={() => props.sub(1, props.item)} key="sub"><Remove /></Button>,
          <Button sx={buttonTheme} onClick={() => props.sub(5, props.item)} key="add">-5</Button>,
        </ButtonGroup>
      </Box>
    </Box>
  )
})

export default CardMidia