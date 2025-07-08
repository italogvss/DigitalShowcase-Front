import { Delete, Edit } from "@mui/icons-material";
import { Box } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridRenderCellParams, GridRowParams } from "@mui/x-data-grid";
import { Template } from "../../Model/TemplateModel";
function renderCellColor1(params: GridRenderCellParams<any, string>) {
  return (
    <Box sx={{
      aspectRatio: 1,
      height: '90%',
      borderRadius: '10%',
      backgroundColor: params.row.color1
    }} />
  )
}
function renderCellColor2(params: GridRenderCellParams<any, string>) {
  return (
    <Box sx={{
      aspectRatio: 1,
      height: '90%',
      borderRadius: '10%',
      backgroundColor: params.row.color2
    }} />
  )
}
export function getColumns(handleEdit: (params: GridRowParams<any>) => void, handleDelete: (params: GridRowParams<any>) => void) {

  const columnsDesktop: GridColDef<Template>[] = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 8,
      editable: false,
      hideable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<any, any>) => {
        if (params.row.isDefault)
          return <><strong>* {params.row.name}</strong></>
        else
          return params.row.name
      }
    },
    {
      field: 'color1',
      headerName: 'Cor 1',
      align: 'center',
      display: 'flex',
      renderCell: renderCellColor1,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'color2',
      headerName: 'Cor 2',
      align: 'center',
      display: 'flex',
      renderCell: renderCellColor2,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'actions',
      type: 'actions',
      disableColumnMenu: true,
      width: 10,

      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
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
          onClick={() => { handleDelete(params) }}
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
      ],
    },
  ];

  const columnsMobile: GridColDef<any>[] = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'color1',
      headerName: 'Cor Primaria',
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'color2',
      headerName: 'Cor Secundaria',
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'actions',
      type: 'actions',
      disableColumnMenu: true,
      width: 10,

      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
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