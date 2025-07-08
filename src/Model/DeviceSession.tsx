import { Playlist } from "./PlaylistModel";

export type DeviceSessionDTO = {
  id: number;
  playlistId: number;
  deviceId: string;
  sessionId: string;
  name?: string;
  connectedAt: string;  
  lastSeen: string;    
  status: string;
};

export type DeviceSession = {
  id: number;
  playlist: Playlist;
  deviceId: string;
  name?: string;
  sessionId: string;
  connectedAt: string;  
  lastSeen: string;    
  status: boolean;
};

export type UpdateDeviceName = {
  id: number,
  name: string
}