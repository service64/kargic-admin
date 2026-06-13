/** Matches server `IUseCase` / `uploadImageSchema`. */
export type MediaUseCase =
  | 'CATEGORY'
  | 'LOGO'
  | 'PRODUCT'
  | 'USER'
  | 'BANNER'
  | 'MESSAGE'
  | 'VERIFICATION'
  | 'BLOG'

export type UploadedImage = {
  _id: string
  name: string
  url: string
  size: number
  alt?: string
  useCase: MediaUseCase
  createdAt?: string
}
