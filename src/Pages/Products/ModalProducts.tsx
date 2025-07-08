import { Delete, HelpOutline } from "@mui/icons-material";
import { Backdrop, Box, Button, Divider, Fade, IconButton, List, ListItem, ListItemText, Modal, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { Product } from "../../Model/ProductModel";
import { useCreateProductMutation, useUpdateProductsMutation } from "../../service/ProductService";
import { useAppSelector } from "../../store/hooks";
import { parseProductFile } from "../../Util/parseTxt";
import { LoadingButton } from "@mui/lab";
import DialogQuiz from "../../Components/Modal/DialogQuiz";
import ModalHeader from "../../Components/Modal/ModalHeader";

type Props = {
  open: boolean;
  productState: Product[]
  handleClose: () => void;
}

const ProductsModal = (props: Props) => {
  const theme = useTheme()
  const user = useAppSelector(state => state.auth.user);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState(false);
  const products = useRef<Product[]>([]);
  const [createProducts, {isLoading: isCreating}] = useCreateProductMutation();
  const [updateProducts, {isLoading: isUpdating}] = useUpdateProductsMutation();

  useEffect(() => {
    if (!props.open) {
      setSelectedFile(null);
      setError(false)
      products.current = []
    }
  }, [props.open]);

  async function handleFiles() {
    if (user?.id && selectedFile) {
      try {
        const newProducts = await parseProductFile(selectedFile, user.id);
        products.current = newProducts
        setOpenDialog(true)
      } catch (error) {
        toast.error("Erro ao processar os arquivos.");
      }
    } else {
      setError(true)
    }
  }
  function onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setError(false)
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/plain': ['.txt'] },
    onDrop,
    multiple: false,
  });

  async function saveProducts(newProducts: Product[]) {
    // Separar os produtos a serem criados e atualizados
    const productsToUpdate: Product[] = [];
    const productsToCreate: Product[] = [];

    newProducts.forEach(newProduct => {
      const matchingProduct = props.productState.find(
        currentProduct => currentProduct.idProduct === newProduct.idProduct
      );

      if (matchingProduct) {
        // Atualizar se houver diferença nos campos relevantes
        if (
          matchingProduct.name !== newProduct.name ||
          matchingProduct.price !== newProduct.price ||
          matchingProduct.priceTableId !== newProduct.priceTableId
        ) {
          productsToUpdate.push({
            ...newProduct,
            id: matchingProduct.id,
            priceTableId: matchingProduct.priceTableId
          });
        }
      } else {
        // Criar se não existir no currentProducts
        productsToCreate.push(newProduct);
      }
    });

    // Criar lista de Promises
    const promises: Promise<any>[] = [];

    // Adiciona a chamada de criação na lista de Promises
    if (productsToCreate.length > 0) {
      promises.push(createProducts(productsToCreate));
    }

    // Adiciona a chamada de atualização na lista de Promises
    if (productsToUpdate.length > 0) {
      promises.push(updateProducts(productsToUpdate));
    }
    await Promise.all(promises)
  }

  async function handleCloseDialog(option: boolean) {
    setOpenDialog(false);
    if (option && products.current) await saveProducts(products.current)
    props.handleClose()
  }

  return (

    <Modal open={props.open} onClose={props.handleClose} closeAfterTransition slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 250 } }}
    >
      <Fade in={props.open}>

        <Box sx={{
          position: 'absolute' as 'absolute', top: '50vh', left: '50vw', transform: 'translate(-50%, -50%)',
          bgcolor: 'white', borderRadius: '15px', boxShadow: 10, p: 4, width: isMobile ? '100vw' : '27vw'
        }}>
          <DialogQuiz title={"Adicionar novos produtos?"}
          text={`Foram encontrados ${products.current.length} produtos. Deseja adicionar-los?`}
          open={openDialog} handleClose={handleCloseDialog}
          variant="info"/>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'left' }}>
            <ModalHeader title={'Importar Produtos'} onClose={() => props.handleClose()} />
            <Divider />
            {!selectedFile ? (<><Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Arraste e solte arquivos .txt aqui, ou clique para selecionar.
            </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #aaa',
                  padding: '20px',
                  marginTop: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  width: '100%',
                  height: '70%',
                  boxSizing: 'border-box',
                }}
              >
                <input {...getInputProps()} />
                {(isDragActive) ? (
                  <Typography>Solte os arquivos aqui...</Typography>
                ) : (
                  <Typography sx={{ color: error ? 'red' : 'inherit' }}>
                    {error ? "Selecione um arquivo para processar" : "Arraste arquivos .txt ou clique para selecionar"}
                  </Typography>
                )}
              </Box>
            </>)
              :
              (<Typography sx={{ mt: 2 }}> Deseja processar este arquivo?</Typography>)}
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <ListItem
                    key={selectedFile.name}
                    secondaryAction={
                      <IconButton onClick={() => setSelectedFile(null)}>
                        <Delete sx={{
                          color: 'gray',
                          '&:hover': {
                            color: 'red',
                          },
                        }} />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={`${selectedFile.name}`} />
                  </ListItem>

                </List>
              </Box>
            )}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Ajuda">
                <IconButton aria-label="Ajuda" size='medium' sx={{}}>
                  <HelpOutline sx={{ color: theme.palette.primary.main }} fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <LoadingButton
                variant="contained"
                color="secondary"
                onClick={() => handleFiles()}
                loading={isCreating || isUpdating}
              >
                Processar
              </LoadingButton>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 1 }}
                onClick={props.handleClose}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ProductsModal