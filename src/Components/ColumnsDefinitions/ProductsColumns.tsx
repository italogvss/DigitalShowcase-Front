import { GridColDef } from "@mui/x-data-grid";
import { PriceTable } from "../../Model/PriceTableModel";
export function getColumns(priceTable: PriceTable[]) {

  const columnsDesktop: GridColDef<any>[] = [
    {
      field: 'idProduct',
      headerName: 'ID',
      hideable: false,
      editable: false,
      filterable: false,

    },
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      editable: true,
      hideable: false,
      filterable: false
    },
    {
      field: 'price',
      headerName: 'Preço',
      width: 150,
      editable: true,
      type: "number",
      align: 'right',
      headerAlign: 'center',
      hideable: false,
      filterable: false,
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
        return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    },
    {
      field: 'priceTableId',
      headerName: 'Tabela',
      type: 'singleSelect',
      align: 'right',
      headerAlign: 'center',
      hideable: false,
      width: 150,
      editable: true,
      getOptionValue: (value: any) => value.id,
      getOptionLabel: (value: any) => value.name,
      valueOptions: priceTable
    },
  ];

  const columnsMobile: GridColDef<any>[] = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      editable: true,
      hideable: false,
    },
    {
      field: 'price',
      headerName: 'Preço',
      editable: true,
      headerAlign: 'center',
      align: 'right',
      hideable: false,
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
        return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    },
    {
      field: 'priceTableId',
      headerName: 'Tabela',
      type: 'singleSelect',
      align: 'right',
      headerAlign: 'center',
      editable: true,
      hideable: false,

      getOptionValue: (value: any) => value.id,
      getOptionLabel: (value: any) => value.name,
      valueOptions: priceTable,

    },

  ];
  return [columnsDesktop, columnsMobile]
}