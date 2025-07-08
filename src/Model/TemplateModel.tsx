import { Media } from "./MediaModel"

export type Template = {
  //info
  id?: number,
  userId?: number
  name: string,
  rows: number,
  columns: number,

  //colors
  color1: string,
  color2: string,
  textColor: string,
  priceColor: string,
  isTranslucid: boolean,
  translucid: number,
  isStriped: boolean,

  //text
  textSize: number,
  textPos: string,
  pricePos: string,
  cipherPos: string,
  cipher: string,
  showName: boolean

  //image
  haveImage: boolean,
  imagePos: number,
  imageSize: number,
  image?: Media,
  haveBackground: boolean,
  background?: Media,

  //grid
  haveGrid: boolean,
  //Para manusear é string[] para enviar é string concatenada
  grid: string[],
  gridColor: string,
  isDefault: boolean
}

export type TemplateDTO = {
  //info
  id?: number,
  userId?: number
  name: string,
  rows: number,
  columns: number,

  //colors
  color1: string,
  color2: string,
  textColor: string,
  priceColor: string,
  isTranslucid: boolean,
  translucid: number,
  isStriped: boolean,

  //text
  textSize: number,
  textPos: string,
  pricePos: string,
  cipherPos: string,
  cipher: string,

  //image
  haveImage: boolean,
  imagePos: number,
  imageSize: number,
  image?: number,
  haveBackground: boolean,
  background?: number,

  //grid
  haveGrid: boolean,
  //Para manusear é string[] para enviar é string concatenada
  grid: string,
  gridColor: string,
  isDefault: boolean
}