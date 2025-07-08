import styled from "@mui/material/styles/styled";
import { DataGridProps } from "@mui/x-data-grid";
import { GridToolbarContainer } from "@mui/x-data-grid/components/containers/GridToolbarContainer";
import { GridToolbarQuickFilter, GridToolbarQuickFilterProps } from "@mui/x-data-grid/components/toolbar/GridToolbarQuickFilter";
import { DataGrid } from "@mui/x-data-grid/DataGrid/DataGrid";

export const StyledDataGrid = styled((props: DataGridProps) => (<DataGrid {...props} />))(({ theme, }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: '10px',
  boxShadow: theme.customShadows.shadowBox,
  
  '& .MuiDataGrid-cell': {
    borderBottom: 'none',
    fontSize: '1.1rem',
    '&:hover': {
      backgroundColor: '#e0e0e0',
      '& .MuiListItemIcon-root': {
        opacity: 1,
        color: '#121c29',
      }
    }
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: 'none',
    borderTop: `1px solid ${theme.palette.grey[300]}`,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    borderTop: 'none',
    fontSize: '1.4rem',
    fontWeight: 'bold'
  }

}));

export const CustomQuickFilter = styled((props: GridToolbarQuickFilterProps) => (<GridToolbarQuickFilter {...props} variant="outlined" />))(({ theme }) => ({
  marginTop: 0,
  marginBottom: 0,
  fontSize: '1.3rem',
  padding: 0,
  marginRight: theme.spacing(1),
  flex: 1,
  maxHeight: '100%',
  justifyContent: 'center',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1)
  }
}));

export const CustomToolbarContainer = styled(GridToolbarContainer)({
  display: 'flex',
  justifyContent: 'space-between',
});

