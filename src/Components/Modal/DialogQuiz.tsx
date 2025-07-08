import { Info, Warning } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
type Variant = "warning" | "info"
type Props = {
  open: boolean
  handleClose: (option: boolean) => void
  title: string
  text: string
  variant: Variant
}
export default function DialogQuiz(props: Props) {
  const bgColor = { "warning": "secondary.main", "info": "info.main" }
  const icon = {
    "warning": <Warning sx={{mr: 1, fontSize: "3.5rem"}}/>,
    "info": <Info sx={{mr: 1, fontSize: "3.5rem"}}/>
  }
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      sx={{ "& .MuiDialog-paper": { borderRadius: 3 } }}
    >
      <Box sx={{ p: 1, backgroundColor: bgColor[props.variant], color: "white", display: "flex", alignItems: "center" }}>
        <Typography variant='h3' sx={{ mb: 1, ml: 1 }}>{props.title}</Typography>
      </Box>
      <DialogContent>
        <DialogContentText sx={{display: "flex", alignItems:"center"}}>
         {icon[props.variant]}<Typography variant={'body1'} fontWeight={600} sx={{ mb: 2 }}>{props.text}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => props.handleClose(false)}>Não</Button>
        <Button
          variant="contained"
          color="secondary" onClick={() => props.handleClose(true)} autoFocus>Sim</Button>
      </DialogActions>
    </Dialog>
  );
}
