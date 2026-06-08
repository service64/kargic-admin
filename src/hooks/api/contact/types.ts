export type AdminContactListRowDto = {
  _id: string
  email: string
  hasNewMessage: boolean
  newUnreadCount: number
}

export type AdminContactListMetaDto = {
  page: number
  limit: number
  total: number
  totalPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type AdminContactListPageDto = {
  data: AdminContactListRowDto[]
  meta: AdminContactListMetaDto
}

export type AdminContactListQueryParams = {
  page?: number
  limit?: number
  searchTerm?: string
}

export type AdminContactMessageDto = {
  _id: string
  name: string
  phone: string
  userType: string
  message: string
  isRead: boolean
  createdAt: string
}

export type AdminContactMessagesPageDto = {
  _id: string
  email: string
  hasNewMessage: boolean
  newUnreadCount: number
  data: AdminContactMessageDto[]
  meta: AdminContactListMetaDto
}

export type AdminContactMessagesQueryParams = {
  page?: number
  limit?: number
}

export type MarkContactMessagesReadBody = {
  messageIds: string[]
}

export type MarkContactMessagesReadResultDto = {
  _id: string
  email: string
  hasNewMessage: boolean
  newUnreadCount: number
  markedCount: number
}
