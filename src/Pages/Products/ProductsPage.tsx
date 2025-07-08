import { Add, Delete, Edit, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import { GridApi } from '@mui/x-data-grid'
import { GridRowSelectionModel } from '@mui/x-data-grid/models/gridRowSelectionModel'
import { useEffect, useRef, useState } from 'react'
import { getColumns } from '../../Components/ColumnsDefinitions/ProductsColumns'
import { CustomQuickFilter, CustomToolbarContainer, StyledDataGrid } from '../../Components/DataGrid'
import PageHeader from '../../Components/PageHeader'
import { Product } from '../../Model/ProductModel'
import { useDeleteProductsMutation, useFindAllProductsQuery, useUpdateProductsMutation } from '../../service/ProductService'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setProducts } from '../../store/reducers/product'
import ModalCRUDPriceTable from './ModalCRUDPriceTable'
import ProductsModal from './ModalProducts'
import { useFindAllPlaylistsQuery } from '../../service/PlaylistService'
import { PriceTable } from '../../Model/PriceTableModel'
import ProductsHelper from './Helper'

type Props = {}

const notSelectTable: PriceTable = {
    id: null,
    userId: null,
    name: 'Nenhuma Tabela',
};

const ProductsPage = (props: Props) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //State Hooks
  const [openImport, setOpenImport] = useState(false);
  const [openCRUD, setOpenCRUD] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [hasModifications, setHasModifications] = useState(false)
  const [selectTables, setSelectTables] = useState<PriceTable[]>([])
  //Refs
  const dataGridRef = useRef<GridApi | null>(null);
  const updatedProductsRef = useRef<Product[]>([]);

  //Redux Hooks
  const dispatch = useAppDispatch()
  const products = useAppSelector(state => state.product);
  const user = useAppSelector(state => state.auth.user);
  const priceTables = useAppSelector(state => state.priceTable);
  const playlists = useAppSelector(state => state.playlist)
  

  // API Hooks
  useFindAllPlaylistsQuery(user?.id?.toString() || '')
  useFindAllProductsQuery(user?.id?.toString() || '', { refetchOnMountOrArgChange: true })
  const [deleteProducts, { isLoading: isDeleting }] = useDeleteProductsMutation();
  const [updateProducts, { isLoading: isUpdating }] = useUpdateProductsMutation();

  useEffect(() => {
    setSelectTables(prev => [...prev, ...priceTables, notSelectTable]);
}, [priceTables]);
  
  async function handleDelete() {
    await deleteProducts(selectedProducts)
  }
  

  async function handleSave() {
    await updateProducts(updatedProductsRef.current)
    checkPlaylists(updatedProductsRef.current)
    setHasModifications(false)
  }

  function checkPlaylists(products: Product[]){
    console.log("Products", products)
      // ids das priceTables
      const priceTableIds = new Set<number>(
        products.map(p => p.priceTableId).filter((id): id is number => id !== null)
    );

      // Filtra as playlists que contém itens do tipo PriceTable com id presente no Set
      const matchingPlaylists = playlists.filter(p =>
          p.items.some(i =>
              i.type === "priceTable" && // Verifica se o item é do tipo "priceTable"
              priceTableIds.has((i.data as PriceTable).id ?? 0) // Verifica se o id do PriceTable está no Set
          )
      );
      console.log(matchingPlaylists)
  }

  function handleSelectionChange(selectionModel: GridRowSelectionModel) {
    setSelectedProducts(selectionModel as number[]);
  }

  function handleCellClick(params: { field: string; id: any; }) {
    if (params.field === 'priceTableId') {
      dataGridRef.current?.startCellEditMode({ id: params.id, field: params.field });
    }
  };

  function handleRowUpdate(newRow: Product, oldRow: Product) {
    const newProducts = products.map(product => {
      if (product.id !== null && selectedProducts.includes(product.id)) {
        
        const updatedProduct = {
          ...product,
          priceTableId: newRow.priceTableId
        };
        updatedProductsRef.current = updatedProductsRef.current.filter(
          p => p.id !== updatedProduct.id
        );
        updatedProductsRef.current.push(updatedProduct);
        return updatedProduct;
      }
      return product.id === newRow.id ? newRow : product;
    });
    // Adiciona ou substitui a row modificada em updatedProductsRef
    updatedProductsRef.current = updatedProductsRef.current.filter(product => product.id !== newRow.id);
    updatedProductsRef.current.push(newRow);
    dispatch(setProducts(newProducts))
    setHasModifications(true);
    setSelectedProducts([]);
    return newRow;
  };

  const CustomToolbar = () => {
    return (
      <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '60px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', px: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <CustomQuickFilter placeholder="Buscar itens..." variant={'filled'} />
          <LoadingButton color="success" variant="contained" disabled={!hasModifications} onClick={() => handleSave()} loading={isUpdating}
            startIcon={<Save />}>
            Salvar
          </LoadingButton>
          <LoadingButton color="error" variant="contained" disabled={!selectedProducts.length} loading={isDeleting} onClick={() => handleDelete()}
            startIcon={<Delete />}>
            Excluir
          </LoadingButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button color="secondary" variant="contained" sx={{ mb: 1 }} onClick={() => setOpenImport(true)}>
            <Add sx={{ marginRight: '3px' }} /> Importar com txt
          </Button>
          <Button color="secondary" variant="contained" sx={{ mr: 1, mb: 1 }} onClick={() => setOpenCRUD(true)}>
            <Edit sx={{ marginRight: '3px' }} /> Minhas tabelas
          </Button>
          <ModalCRUDPriceTable open={openCRUD} onClose={() => setOpenCRUD(false)} />
          <ProductsModal productState={products}
            open={openImport}
            handleClose={() => setOpenImport(false)} />
        </Box>
      </CustomToolbarContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <PageHeader title={"Produtos"} desc={"Exporte seus produtos, e os atribua a tabelas de preço, que podem ser utilizadas nas playlists!"} help={<ProductsHelper/>} />
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3, }}>
        <StyledDataGrid
          sx={{
            maxWidth: '98%',
            ...(isMobile && {
              '& .MuiDataGrid-cell': {
                fontSize: '0.9rem',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontSize: '1rem',
                fontWeight: 'bold',
              },
            }),
            
          }}
          rows={products}

          columns={getColumns(selectTables)[isMobile ? 1 : 0]}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 15,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          keepNonExistentRowsSelected
          disableRowSelectionOnClick
          rowSelectionModel={selectedProducts}
          onRowSelectionModelChange={handleSelectionChange}
          processRowUpdate={handleRowUpdate}
          checkboxSelection={isMobile ? false : true}
          density={"compact"}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{ toolbar: { quickFilterProps: { debounceMs: 500 } } }}
          sortingOrder={['desc', 'asc']}
          onCellClick={handleCellClick}
        />
      </Box>


    </Box>
  )
}

export default ProductsPage