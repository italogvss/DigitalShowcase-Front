export type Media = {
  id: number
  userId: number
  desc: string
  type: string
  size: number
  url: string
  urlPreview: string
  sec: number
}

export type MediaData = {
  userId: number
  desc: string
  type: string
  data: Blob
  sec: string
}