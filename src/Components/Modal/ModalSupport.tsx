import { Email, WhatsApp } from '@mui/icons-material';
import { Backdrop, Box, Divider, Fade, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ModalHeader from './ModalHeader';

type Props = {
  open: boolean;
  onClose: () => void;
};


const ModalSupport = (props: Props) => {

  return (
    <Modal open={props.open} onClose={props.onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}>
      <Fade in={props.open}>
        <Box sx={{
          position: "absolute" as "absolute", top: "50vh", left: "50vw", transform: "translate(-50%, -50%)",
          bgcolor: "white", borderRadius: "15px", boxShadow: 10, p: 4, width: "30vw"
        }}>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "left", alignItems: "left" }}>
            <ModalHeader title="Contatos de Suporte" onClose={props.onClose} />
            <Divider />
            <Box sx={{ my: 2, display: "flex" }}>
              <Grid container width="100%" spacing={1}>
                <Grid size={12} sx={{ display: "flex" }}>
                  <WhatsApp sx={{ mr: 1 }} /><Typography><strong>WhatsApp: </strong> +45 99471717</Typography>
                </Grid>
                <Grid size={12} sx={{ display: "flex" }}>
                  <Email sx={{ mr: 1 }} /><Typography><strong>Email: </strong> </Typography>
                </Grid>
                <Grid size={12}>

                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalSupport;

