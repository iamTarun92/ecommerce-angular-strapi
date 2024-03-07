import { Address } from "./order"

export interface AddressRoot {
    data: AddressData[]
    meta: Meta
}

export interface AddressData {
    id: number
    attributes: AddressAttributes
}

export interface AddressAttributes {
    email: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    primary: boolean
    type: string
    fullName: string
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
