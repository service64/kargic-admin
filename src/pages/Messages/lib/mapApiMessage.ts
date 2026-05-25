export type UiOrderPreview = {
  orderId: string
  status: string
  productName: string
  productImageUrl: string | null
  quantity: number
  unitPrice: number
  totalAmount: number
  deliveryMinAt: string | null
  deliveryMaxAt: string | null
}

export type UiProductPreview = {
  productId: string
  productName: string
  slug: string
  productImageUrl: string | null
}

export type UiChatMessage = {
  id: string
  senderId: string
  fromMe: boolean
  type: 'text' | 'image' | 'order' | 'product'
  text: string
  imageUrl?: string
  orderId?: string
  orderPreview?: UiOrderPreview | null
  productId?: string
  productPreview?: UiProductPreview | null
  createdAt: Date
  sendStatus?: 'sending' | 'sent'
}

function asOrderPreview(raw: unknown): UiOrderPreview | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const orderId = o.orderId != null ? String(o.orderId) : ''
  if (!orderId) return null

  return {
    orderId,
    status: typeof o.status === 'string' ? o.status : '',
    productName: typeof o.productName === 'string' ? o.productName : '',
    productImageUrl:
      typeof o.productImageUrl === 'string' && o.productImageUrl
        ? o.productImageUrl
        : null,
    quantity: typeof o.quantity === 'number' ? o.quantity : 0,
    unitPrice: typeof o.unitPrice === 'number' ? o.unitPrice : 0,
    totalAmount: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
    deliveryMinAt:
      o.deliveryMinAt === null || o.deliveryMinAt === undefined
        ? null
        : String(o.deliveryMinAt),
    deliveryMaxAt:
      o.deliveryMaxAt === null || o.deliveryMaxAt === undefined
        ? null
        : String(o.deliveryMaxAt),
  }
}

function asProductPreview(raw: unknown): UiProductPreview | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const productId = o.productId != null ? String(o.productId) : ''
  if (!productId) return null

  return {
    productId,
    productName: typeof o.productName === 'string' ? o.productName : '',
    slug: typeof o.slug === 'string' ? o.slug : '',
    productImageUrl:
      typeof o.productImageUrl === 'string' && o.productImageUrl
        ? o.productImageUrl
        : null,
  }
}

export function normalizeChatEntityId(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null && '_id' in v) {
    return String((v as { _id: unknown })._id)
  }
  return String(v)
}

export function mapApiMessageToUi(
  raw: Record<string, unknown>,
  currentUserId: string,
): UiChatMessage | null {
  const id = normalizeChatEntityId(raw._id)
  const senderId = normalizeChatEntityId(raw.senderId)
  if (!id || !senderId) return null

  const type = raw.type
  if (
    type !== 'text' &&
    type !== 'image' &&
    type !== 'order' &&
    type !== 'product'
  ) {
    return null
  }

  const createdRaw = raw.createdAt
  const createdAt =
    createdRaw instanceof Date
      ? createdRaw
      : new Date(createdRaw ? String(createdRaw) : Date.now())

  const text =
    typeof raw.text === 'string'
      ? raw.text
      : type === 'order' && raw.orderId
        ? `Order #${String(raw.orderId).slice(-6)}`
        : type === 'product' && raw.productId
          ? `Product #${String(raw.productId).slice(-6)}`
          : ''

  return {
    id,
    senderId,
    fromMe: senderId === currentUserId,
    type,
    text,
    imageUrl: typeof raw.imageUrl === 'string' ? raw.imageUrl : undefined,
    orderId: raw.orderId != null ? normalizeChatEntityId(raw.orderId) : undefined,
    orderPreview: asOrderPreview(raw.orderPreview),
    productId:
      raw.productId != null ? normalizeChatEntityId(raw.productId) : undefined,
    productPreview: asProductPreview(raw.productPreview),
    createdAt,
  }
}
