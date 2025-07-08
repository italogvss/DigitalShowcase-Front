import { Add, Close, Remove } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { PlaylistItems } from "../../Model/PlaylistModel";
import { Template } from "../../Model/TemplateModel";
import { PriceTable } from "../../Model/PriceTableModel";

type Props = {
  item: PlaylistItems,
  templates: Template[]
  add: (n: number, item: PlaylistItems) => void
  sub: (n: number, item: PlaylistItems) => void
  removeItem: (item: PlaylistItems) => void
  setTemplate: (item: PlaylistItems, template: Template) => void
  isFixed: boolean
  isFixedTemplate: boolean
}


const CardTable = (props: Props) => {
  const buttonTheme: SxProps<Theme> = {
    color: '#fff',
    backgroundColor: 'secondary.main',
    "&.Mui-disabled": { backgroundColor: "secondary.light" },
    borderRadius: 2,
    "&:hover": { backgroundColor: 'secondary.light' }
  }
  function handleSelectTemplate(e: SelectChangeEvent<any>) {
    const template = props.templates.find(t => t.id === e.target.value)
    if (template)
      props.setTemplate(props.item, template)
  }
  function getType(str: string) {
    return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
  }
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      <Grid container>
        <Grid size={2} sx={{ backgroundColor: 'primary.main', color: '#fff', display: 'flex', justifyContent: 'center', borderRadius: '0px 0px 7px 0px' }}>
          <Typography variant="h6">{`${props.item.order}º`}</Typography>
        </Grid>
        <Grid size={8} sx={{ display: 'flex', justifyContent: 'center', }}>
          <Typography variant="h6">{`${(props.item.data as PriceTable).name}`}</Typography>
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
        <Grid container sx={{ width: '100%', height: '100%' }}>
          <Grid size={3} bgcolor={props.item.template?.color1}></Grid>
          <Grid size={3} bgcolor={props.item.template?.color2}></Grid>
          <Grid size={3} bgcolor={props.item.template?.textColor}></Grid>
          <Grid size={3} bgcolor={props.item.template?.priceColor}></Grid>
        </Grid>
      </Box>
      <Box><Divider /></Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, pb: 0.5, mt: 1, flexDirection: 'column' }}>
        <FormControl fullWidth size="small" disabled={props.isFixedTemplate} sx={{ px: 1 }}>
          <InputLabel id="select" sx={{ px: 1 }}>Template</InputLabel>
          <Select labelId="select" label='Template' 
          value={props.item.template ? props.item.template.id : ""}
          onChange={handleSelectTemplate}  sx={{
            '& .MuiOutlinedInput-input': { padding: 1, paddingLeft: 2, }
          }}>
            {props.templates.map((t) => (<MenuItem value={t.id}>{t.name}</MenuItem>))}
          </Select>
        </FormControl>
        <Typography variant='body1'>Segundos</Typography>
        <ButtonGroup size="small" color='secondary' fullWidth
          disabled={props.isFixed}
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
}

export default CardTable