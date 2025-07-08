import { HelpOutline } from '@mui/icons-material'
import { Box, IconButton, Modal, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useState } from 'react';
import ModalHeader from './Modal/ModalHeader';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  maxWidth: 600,
  width: '90%',
  maxHeight: '90%',
  overflowY: 'auto',
};

type Props = {
  title: string;
  desc: string;
  help: JSX.Element;
};

const PageHeader = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size="grow" sx={{ mr: isMobile ? 1 : 0, flexDirection: 'column' }}>
          <Typography variant="h1" sx={{ ml: isMobile ? 1 : 4, mt: 1 }}>
            {props.title}
          </Typography>
          <Typography variant="h6" sx={{ ml: isMobile ? 1 : 4, mt: 0 }}>
            {props.desc}
          </Typography>
        </Grid>
        <Grid
          size={isMobile ? 'grow' : 3}
          sx={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-end', mr: 4 }}
        >
          <Tooltip title="Ajuda">
            <IconButton
              aria-label="Ajuda"
              size="large"
              sx={{ mb: 1, mr: 1, p: 0.5 }}
              onClick={handleOpen}
            >
              <HelpOutline sx={{ color: theme.palette.primary.main }} fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <ModalHeader title={props.title} key={0} onClose={handleClose}/>
          {props.help}
        </Box>
      </Modal>
    </>
  );
};

export default PageHeader;