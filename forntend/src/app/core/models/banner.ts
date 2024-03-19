export interface BannerRoot {
    data: BannerData[]
    meta: BannerMeta
}

export interface BannerData {
    id: number
    attributes: BannerAttributes
}

export interface BannerAttributes {
    link: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    orderBy: string
    image: Image
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
    medium: Medium
    large: Large
    small: Small
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

export interface Medium {
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

export interface Large {
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

export interface Small {
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

export interface BannerMeta {
    pagination: BannerPagination
}

export interface BannerPagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
}
