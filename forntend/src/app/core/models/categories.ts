export interface CategoriesRoot {
    data: CategoriesData[]
    meta: Meta
  }
  
  export interface CategoriesData {
    id: number
    attributes: Attributes
  }
  
  export interface Attributes {
    name: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    products: Products
    image: Image
  }
  
  export interface Products {
    data: Daum2[]
  }
  
  export interface Daum2 {
    id: number
    attributes: Attributes2
  }
  
  export interface Attributes2 {
    name: string
    slug: string
    price: string
    specialPrice?: string
    description: string
    stockQuantity: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    isFixedPrice: boolean
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
    formats: any
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
  
  export interface Meta {
    pagination: Pagination
  }
  
  export interface Pagination {
    page: number
    pageSize: number
    pageCount: number
    total: number
  }
  