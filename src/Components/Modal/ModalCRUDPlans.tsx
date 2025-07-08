import { Backdrop, Box, Button, Divider, Fade, Modal, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ModalHeader from './ModalHeader';
import { StyledTextField } from '../TextInput';

type Props = {
  open: boolean;
  onClose: () => void;
}

const ModalCRUDPlans = (props: Props) => {
  return (
    <Modal open={props.open} onClose={props.onClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}
    >
      <Fade in={props.open}>
        <Box sx={{
          position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
          bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: '50vw'
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
            <ModalHeader title={'Editar Plano'} onClose={() => props.onClose()} />
            <Divider />
            <Typography variant='h6' mt={2}>Informações</Typography>
            <Box sx={{ my: 2, display: 'flex' }}>
              <Grid container width={'100%'} spacing={1}>
                <Grid size={12}>
                  <StyledTextField label='Nome' />
                </Grid>
                <Grid size={3}>
                  <StyledTextField variant="outlined" label='Playlists' type="number"
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                <Grid size={3}>
                  <StyledTextField variant="outlined" label='Templates' type="number"
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                <Grid size={3}>
                  <StyledTextField variant="outlined" label='Espaço' type="number"
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                <Grid size={3}>
                  <StyledTextField variant="outlined" label='Meses' type="number"
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', mt: 2 }}>
              <Button color="success" variant="contained" onClick={() => props.onClose()}>
                Salvar
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ModalCRUDPlans