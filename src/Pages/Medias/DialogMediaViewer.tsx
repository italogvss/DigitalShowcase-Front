import { Box, Divider, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { Media } from '../../Model/MediaModel';

type Props = {
  open: boolean
  handleClose: () => void
  media: Media
}
export default function MediaViewer(props: Props) {
  return (
    <Dialog

      maxWidth={"lg"}
      open={props.open}
      onClose={props.handleClose}
      sx={{ "& .MuiDialog-paper": { borderRadius: 3, backgroundColor: "primary.main" } }}
    >
      <Box sx={{ p: 1, color: "white" }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: "primary.main", p: 1, }}>
          <Typography variant='h1' noWrap sx={{ mb: 1, ml: 1 }}>{props.media.desc}</Typography>
          <Divider />
        </Box>
        <Box sx={{ p: 0, borderRadius: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          {props.media.type.startsWith("image") ? (
            <img
              src={props.media.url}
              alt={props.media.desc}
              style={{

                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          ) : (<video
            src={props.media.url}
            controls
            crossOrigin="anonymous"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />)}

        </Box>
        <Divider />
        <DialogActions sx={{display:"flex", justifyContent: "space-between"}}>
        <Typography variant='h6'>Tamanho: {`${(props.media.size / 1024).toFixed(2)}Mb`}</Typography>
          <Button variant="contained"
            color="secondary"
            sx={{ mt: 1 }}
            onClick={() => props.handleClose()} autoFocus>Fechar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
