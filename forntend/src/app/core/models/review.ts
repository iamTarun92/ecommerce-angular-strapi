export interface ReviewRoot {
    data: ReviewData[]
    meta: Meta
  }
  
  export interface ReviewData {
    id: number
    attributes: Attributes
  }
  
  export interface Attributes {
    content: string
    note: number
    createdAt: string
    updatedAt: string
    locale: string
    author: Author
    product: Product
    localizations: Localizations
  }
  
  export interface Author {
    data: Data
  }
  
  export interface Data {
    id: number
    attributes: Attributes2
  }
  
  export interface Attributes2 {
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    phone: string
  }
  
  export interface Product {
    data: Data2
  }
  
  export interface Data2 {
    id: number
    attributes: Attributes3
  }
  
  export interface Attributes3 {
    name: string
    slug: string
    price: number
    specialPrice: number
    description: string
    stockQuantity: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    isFixedPrice: boolean
  }
  
  export interface Localizations {
    data: any[]
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
  