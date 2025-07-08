import { Wifi, WifiOff, Star, StarBorder, Delete, Edit } from "@mui/icons-material";
import { Box, Theme } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { DeviceSession } from "../../Model/DeviceSession";
import { formatDate } from "../../Util/timeConverter";

export function getColumns(handleDelete: (params: GridRowParams<DeviceSession>) => void) {
  const columnsDesktop: GridColDef<DeviceSession>[] = [
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
          {params.value ? <Wifi color="success" /> : <WifiOff color="error" />}
        </Box>
      ),

    },
    {
      field: 'playlist',
      headerName: 'Nome Playlist',
      flex: 2,
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <strong>{params.row.playlist.name} </strong>  {`(${params.row.playlist.code})`}
        </Box>
      )
    },
    {
      field: 'connectedAt',
      headerName: 'Conectado em',
      flex: 2,
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {formatDate(params.row.connectedAt)} {/* Exibindo o nome da playlist */}
        </Box>
      )
    },
    {
      field: 'lastSeen',
      headerName: 'Ultima atualização',
      flex: 2,
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {formatDate(params.row.lastSeen)} {/* Exibindo o nome da playlist */}
        </Box>
      )
    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 2,
      editable: true,
      hideable: false,
      filterable: false,
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
      ],
    },

  ];

  const columnsMobile: GridColDef<DeviceSession>[] = [
    {
      field: 'status',
      headerName: 'Status',
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}>
          {params.value ? <Wifi color="success" /> : <WifiOff color="error" />}
        </Box>
      ),
    },
    {
      field: 'deviceId',
      headerName: 'Identificador',
      flex: 1,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'playlist',
      headerName: 'Playlist',
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.value?.name} {/* Exibindo o nome da playlist */}
        </Box>
      )
    },
  ];

  return [columnsDesktop, columnsMobile];
}





