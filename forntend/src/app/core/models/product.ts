export interface ProductRoot {
    data: ProductData[]
    meta: Meta
}

export interface ProductData {
    id: number
    attributes: ProductAttributes
}

export interface ProductAttributes {
    name: string
    slug: string
    price: number
    specialPrice: number
    description: string
    stockQuantity: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    image: Image
    categories: Categories
    isFixedPrice:boolean
}

export interface Image {
    data: Data
}

export interface Data {
    id: number
    attributes: Attributes2
}

export interface Attributes2 {
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
    attributes: Attributes3
}

export interface Attributes3 {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
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
