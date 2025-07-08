import { Delete, Edit, Visibility } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Playlist } from "../../Model/PlaylistModel";
export function getColumns(
  handleEdit: (params: GridRowParams<Playlist>) => void,
  handleDelete: (params: GridRowParams<Playlist>) => void,
  handleViewPlaylist: (params: GridRowParams<Playlist>) => void){
  
const columnsDesktop: GridColDef[] = [
  {
    hideable: false,
    field: 'name',
    headerName: 'Nome da Playlist',
    flex: 1,
    editable: false,
  },
  {
    hideable: false,
    field: 'itemsCount',
    headerName: 'Itens',
    width: 100,
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    editable: false,
    align: 'center',
    valueGetter: (value, row) => {
      return row.items ? row.items.length : 0;
    }
  },
  {
    hideable: false,
    field: 'code',
    headerName: 'Código',
    width: 120,
    disableColumnMenu: true,
    filterable: false,
    sortable: false,
    align: 'center',
    editable: false,
    renderCell: (params: GridRenderCellParams<any, any>) => (
      <Typography variant="body1" color="secondary" fontWeight="600" marginTop="10%" fontSize="1.3rem"
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'actions',
    type: 'actions',
    width: 10,
    filterable: false,
    sortable: false,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<Delete/>}
        label="Deletar"
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0',
            '& .MuiListItemIcon-root': {
              opacity: 1,
              color: 'red',
            }
          }
        }}
        onClick={() => {handleDelete(params)}}
        showInMenu
      />,
      <GridActionsCellItem
        icon={<Edit />}
        label="Editar"
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0',
            '& .MuiListItemIcon-root': {
              opacity: 1,
              color: '#121c29',
            }
          }
        }}
        onClick={() => handleEdit(params)}
        showInMenu
      />,
      <GridActionsCellItem
        icon={<Visibility />}
        label="Visualizar"
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0',
            '& .MuiListItemIcon-root': {
              opacity: 1,
              color: '#121c29',
            }
          }
        }}
        onClick={() => handleViewPlaylist(params)}
        showInMenu
      />,
    ],
  },

];

const columnsMobile: GridColDef[] = [

  {
    field: 'name',
    headerName: 'Nome da Playlist',
    flex: 6,
    filterable: false,
    sortable: true,
    editable: false,
  },
  {
    field: 'code',
    flex: 4,
    filterable: false,
    sortable: false,
    disableColumnMenu: true,
    headerName: 'Código',
    editable: false,
  },
  {
    field: 'actions',
    type: 'actions',
    disableColumnMenu: true,
    width: 10,

    getActions: (params) => [
      <GridActionsCellItem
        icon={<Delete color='error' />}
        label="Deletar"
        onClick={() => { }}
        showInMenu
      />,
      <GridActionsCellItem
        icon={<Edit />}
        label="Editar"
        onClick={() => { }}
        showInMenu
      />,
    ],
  },
];
return [columnsDesktop, columnsMobile]
}