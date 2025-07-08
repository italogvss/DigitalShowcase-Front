import { Delete, Edit } from "@mui/icons-material";
import { GridColDef, GridActionsCellItem, GridRenderCellParams } from "@mui/x-data-grid";
import { User } from "../../Model/UserModel";
export function getColumns() {

  const columnsDesktop: GridColDef<any>[] = [
    {
      field: 'id',
      headerName: 'Id',
      type: 'number',
      width: 50,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      editable: false,
      hideable: false,
      filterable: false
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
    },
    {
      field: 'isActive',
      headerName: 'Ativo',
      type: 'boolean',
      width: 150,
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
    },
    {
      field: 'validUntil',
      headerName: 'Valido até',
      type: 'string',
      width: 150,
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<User>) => {

        const validUntil = params.row.validUntil;
        return validUntil ? validUntil : "vitalício"
      }
    },
    {
      field: 'role',
      headerName: 'Tipo',
      type: 'string',
      width: 100,
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
    },
    {
      field: 'ownerId',
      headerName: 'Dono',
      type: 'string',
      width: 100,
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams<User>) => {

        const owner = params.row.owner;
        return owner ? owner.username : ""
      }
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
      field: 'planType',
      headerName: 'Plano',
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
    },
    {
      field: 'active',
      headerName: 'Ativo',
      type: 'boolean',
      editable: false,
      align: 'right',
      hideable: false,
      filterable: false,
    },
  ];
  return [columnsDesktop, columnsMobile]
}