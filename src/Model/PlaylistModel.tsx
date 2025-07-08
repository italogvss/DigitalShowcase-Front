import { Media } from "./MediaModel"
import { PriceTable } from "./PriceTableModel"
import { Template } from "./TemplateModel"

export type Playlist = {
  id?: number,
  userId: number,
  name: string,
  isVertical: number
  code?: string
  isTimeFixed: boolean
  isTemplateFixed: boolean
  items: PlaylistItems[]
}

export type PlaylistDTO = {
  id?: number,
  userId: number,
  name: string,
  isVertical: number
  code?: string
  isTimeFixed: boolean
  isTemplateFixed: boolean
  items: PlaylistItemsDTO[]
}

export type PlaylistItems = {
  tempId?: number
  id?: number
  type: ItemType
  data: Media | PriceTable
  template?: Template
  order: number
  seconds: number
}

export type PlaylistItemsDTO = {
  id?: number
  type: ItemType
  media?: number
  priceTable?: number
  template?: number
  order: number
  seconds: number
  playlist: number
}



export type ItemType = "image" | "priceTable" | "video"