export interface SystemInfoDTO {
  cpuUsage: number;
  uptime: number;
  memoryAvailable: number;
  memoryUsed: number;
}

export interface AppInfoDTO {
  userCount: number; //
  activeUserCunt: number; //
  priceTableCount: number;
  playlistCount: number;
  midiaCount: number;//
  imageCount: number;//
  videoCount: number;//
  midiaSize: number;//
  deviceCount: number; //
  onlineDeviceCount: number;
}

export interface InfoDTO {
  app: AppInfoDTO;
  sys: SystemInfoDTO;
}