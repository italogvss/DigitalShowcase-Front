import { Media } from "./MediaModel";
import { Product } from "./ProductModel";
import { Template, TemplateDTO } from "./TemplateModel";

export type FullPlaylist = {
  name: string,
  isVertical: boolean,
  items: FullPlaylistItem[]
}

export type FullPlaylistItem = {
  type: string,
  media: Media,
  priceTable: PriceTableLayout,
  template: Template,
  products: Product[],
  order: number,
  seconds: number,
}

export type PriceTableLayout = {
  id?: number
  playlistId: number
  priceTableId: number
  html: string,
  part: number,
  order: number
}