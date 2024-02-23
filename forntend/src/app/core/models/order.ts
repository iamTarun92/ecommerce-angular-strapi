export interface OrderRoot {
    data: OrderData[]
    meta: Meta
}

export interface OrderData {
    id: number
    attributes: OrderAttributes
}

export interface OrderAttributes {
    email: string
    orderId: string
    products: Product[]
    address: Address
    name: string
    transactionId: string
    amount: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    shipingAmt: number
    paymentMethod: string
    orderDate: string
    paymentStatus: string
    orderStatus: string
}

export interface Product {
    id: number
    attributes: Attributes2
    quantity: number
}

export interface Attributes2 {
    name: string
    slug: string
    price: number
    specialPrice?: number
    description: string
    stockQuantity: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    isFixedPrice: boolean
    image: Image
    categories: Categories
}

export interface Image {
    data: Data
}

export interface Data {
    id: number
    attributes: Attributes3
}

export interface Attributes3 {
    name: string
    alternativeText: any
    caption: any
    width: number
    height: number
    formats: Formats
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: any
    provider: string
    provider_metadata: any
    createdAt: string
    updatedAt: string
}

export interface Formats {
    thumbnail: Thumbnail
}

export interface Thumbnail {
    name: string
    hash: string
    ext: string
    mime: string
    path: any
    width: number
    height: number
    size: number
    url: string
}

export interface Categories {
    data: Daum2[]
}

export interface Daum2 {
    id: number
    attributes: Attributes4
}

export interface Attributes4 {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
}

export interface Address {
    billing: Billing
    deliver: Deliver
}

export interface Billing {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
}

export interface Deliver {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
}

export interface Meta {
    pagination: Pagination
}

export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}
