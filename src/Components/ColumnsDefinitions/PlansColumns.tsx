import { Edit, Delete } from "@mui/icons-material";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
export function getColumns() {

const columnsDesktop: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nome',
    flex: 1,
    editable: false,
    hideable: false,
    filterable: false,
  },
  {
    field: 'playlists',
    headerName: 'Playlists',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: false,
  },
  {
    field: 'templates',
    headerName: 'Templates',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: false,
  },
  {
    field: 'space',
    headerName: 'Espaço',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: true,
    valueGetter: (value) => {
      if (!value) {
        return value;
      }
      return value
    },
    valueFormatter: (value?: number) => {
      if (value == null) {
        return '';
      }
      return `${value} Mb`;
    },
  },
  {
    field: 'meses',
    headerName: 'Meses',
    type: 'number',
    editable: false,
    width: 100,
    align: 'right',
    hideable: false,
    filterable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    disableColumnMenu: true,
    width: 80,
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
        onClick={() => { }}
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
        onClick={() => { }}
        showInMenu
      />,
    ],
  },
];

const columnsMobile: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nome do Plano',
    flex: 1,
    editable: false,
    hideable: false,
    filterable: true,
  },
  {
    field: 'playlists',
    headerName: 'Playlists',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: true,
  },
  {
    field: 'templates',
    headerName: 'Templates',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: true,
  },
  {
    field: 'space',
    headerName: 'Espaço (MB)',
    type: 'number',
    width: 120,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: true,
  },
  {
    field: 'meses',
    headerName: 'Duração (Meses)',
    type: 'number',
    width: 150,
    editable: false,
    align: 'right',
    hideable: true,
    filterable: true,
  },
  {
    field: 'actions',
    type: 'actions',
    disableColumnMenu: true,
    width: 100,
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
        onClick={() => { }}
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
        onClick={() => { }}
        showInMenu
      />,
    ],
  },
];
return [columnsDesktop, columnsMobile]
}