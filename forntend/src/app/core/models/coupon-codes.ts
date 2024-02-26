export interface CouponRoot {
  data: CouponData[]
  meta: CouponMeta
}

export interface CouponData {
  id: number
  attributes: Attributes
}

export interface Attributes {
  code: string
  discount: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  startDate: string
  endDate: string
  minOrder: number
  isfixed: boolean
}

export interface CouponMeta {
  pagination: Pagination
}

export interface Pagination {
  page: number
  pageSize: number
  pageCount: number
  total: number
}
