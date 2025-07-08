
import { Sync, Update } from "@mui/icons-material";
import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { GridRowParams } from "@mui/x-data-grid/models/params";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getColumns } from "../../Components/ColumnsDefinitions/DisplaysColumns";
import { CustomToolbarContainer, StyledDataGrid } from "../../Components/DataGrid";
import PageHeader from "../../Components/PageHeader";
import { DeviceSession, DeviceSessionDTO } from "../../Model/DeviceSession";
import { useBroadcastUserUpdateMutation, useDeleteSessionMutation, useLazyFindAllDeviceSessionQuery, useUpdateNameMutation } from "../../service/DeviceSessionService";
import { useFindAllPlaylistsQuery } from "../../service/PlaylistService";
import { useAppSelector } from "../../store/hooks";
import { getCurrentDate } from "../../Util/timeConverter";
import Helper from "./Helper";


type Props = {}


const DevicesPage = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State Hooks
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [lastSync, setLastSync] = useState(getCurrentDate());

  // Redux Hooks
  const user = useAppSelector(state => state.auth.user);
  const playlists = useAppSelector(state => state.playlist);
  const [broadcast] = useBroadcastUserUpdateMutation()
  const [deleteSession] = useDeleteSessionMutation()
  const [updateName] = useUpdateNameMutation();
  useFindAllPlaylistsQuery(user?.id?.toString() || '', { skip: playlists.length > 0 })

  // RTK Query Hook
  const [trigger, { data: deviceSessions, isLoading, isSuccess, isError, error }] = useLazyFindAllDeviceSessionQuery();

  useEffect(() => {
    if (isError)
      toast.error("Erro ao buscar dispositivos")
  }, [isError])

  // Dispara a consulta assim que o user.id estiver disponível
  useEffect(() => {
    if (user?.id) {
      trigger(user.id.toString(), false);
    }
  }, [user?.id, trigger]); // Se o user.id mudar, chama o trigger


  useEffect(() => {
    if (deviceSessions) { //lista de DeviceSession
      setSessions(deviceSessions.map(d => toModel(d)))
    }
  }, [deviceSessions]); // Atualiza a lista sempre que os deviceSessions mudam

  function handleSync() {
    if (user?.id) {
      const date = getCurrentDate()
      setLastSync(date)
      trigger(user.id.toString());
    }
  }

  async function handleBroadcast() {
    if (user?.id)
      await broadcast(user.id.toString()).unwrap()
        .then(() => { toast.success("Playlists Atualizadas") })
        .catch((e) => { toast.error("Falha na atualização"); })
  }

  async function handleDelete(params: GridRowParams<DeviceSession>) {
    const id = params.id.valueOf() as number
    if (sessions.find(s => s.id === id)) {
      await deleteSession(id.toString()).unwrap()
        .then(() => {
          setSessions(prev => prev.filter(p => p.id === id))
          toast.success("Seção excluida")
        })
        .catch((e) => { toast.error("Falha ao excluir seção"); })
    } else {
      toast.warn("Não é possivel excluir uma seção ativa")
    }
  }

  function toModel(dto: DeviceSessionDTO): DeviceSession {
    const playlist = playlists.find(p => p.id === dto.playlistId);
    const status = dto.status === 'ONLINE';

    return {
      id: dto.id,
      playlist: playlist || { userId: 0, name: "ERRO", isVertical: 0, isTimeFixed: false, isTemplateFixed: false, items: [] },
      deviceId: dto.deviceId,
      sessionId: dto.sessionId,
      connectedAt: dto.connectedAt,
      lastSeen: dto.lastSeen,
      status: status,
      name: dto.name
    };
  };

  function handleRowUpdate(newRow: DeviceSession, oldRow: DeviceSession, params: { rowId: GridRowId; }) {
    if (newRow.name && newRow.name !== oldRow.name) {
      updateName({ id: newRow.id, name: newRow.name }).unwrap()
        .then(() => {
          toast.success("Nome Atualizado")
          setSessions(prev =>
            prev.map(session =>
              session.id === newRow.id ? { ...session, name: newRow.name } : session
            )
          );
        })
        .catch(() => { })
    }
  }

  const CustomToolbar = () => {
    return (
      <CustomToolbarContainer sx={{ height: isMobile ? 'auto' : '50px', flexDirection: isMobile ? 'column' : 'row', display: 'flex', p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: "center" }}>
          <IconButton
            onClick={() => handleSync()}
            sx={{
              transform: isLoading ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: "transform 0.5s ease, color 0.3s ease",
              "&:hover": {
                transform: "rotate(180deg)",
                color: "primary.main",
              },
            }}
          >
            <Sync />
          </IconButton>

          <Typography variant="body1">Ultima verificação: {lastSync}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button color="secondary" variant="contained" sx={{ mb: 1 }} onClick={() => handleBroadcast()}>
            <Update sx={{ marginRight: '3px' }} />
            Atualizar Playlists
          </Button>
        </Box>
      </CustomToolbarContainer>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <PageHeader title={"Displays"} desc={"Monitore suas playlists!"} help={<Helper/>}/>
      <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', mt: 3 }}>
        <StyledDataGrid
          sx={{ maxWidth: '98%' }}
          rows={sessions}
          columns={getColumns(handleDelete)[isMobile ? 1 : 0]}
          getRowId={(row) => row.id || row.name}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          pageSizeOptions={[10, 20, 30]}
          disableRowSelectionOnClick
          /* onRowSelectionModelChange={handleSelectionChange}
          processRowUpdate={handleProcessRowUpdate} */
          processRowUpdate={handleRowUpdate}
          density={isMobile ? "compact" : 'standard'}
          sortingOrder={['desc', 'asc']}
          slots={{ toolbar: CustomToolbar }}
        /* onCellEditStart={handleCellEditStart} */
        />
      </Box>
    </Box>
  )
}

export default DevicesPage