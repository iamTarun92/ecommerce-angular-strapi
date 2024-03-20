import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { ProductData, ProductRoot, ProductRoot2 } from '../../models/product';
import { CategoriesRoot } from '../../models/categories';
import { OrderRoot } from '../../models/order';
import { ReviewRoot } from '../../models/review';
import { AddressRoot } from '../../models/address';
import { BannerRoot } from '../../models/banner';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    // const token = this.getSessionToken();
    // const headers = new HttpHeaders({
    //     'Authorization': `Bearer ${token}`
    // });

    private baseUrl = 'http://localhost:1337/api'

    private token = '843314a7e24e5cd634ac43601994e542ed4cd7924ed0197d00d027aa908265bdf84cc5820bfb15c90a92cdd1dda5adba3c7099522a50ad763927a93725f2e9440ba80c23b2f237ce1873b46150acfb7435e90a9de60a7177757be0b0f44df14852bb118f9995a1660a11c7a281a1fbc47b15992b6b7aef95eaaf071b4bd9f996'


    constructor(private http: HttpClient) {
        // localStorage.setItem('session_token', this.token)
    }

    getSessionToken() {
        return localStorage.getItem('session_token');
    }

    fetchProducts(): Observable<ProductRoot> {
        const url = `/products?populate=*`
        return this.http.get<ProductRoot>(this.baseUrl + url).pipe(map(data => data as ProductRoot))
    }
    fetchProductById(id: number): Observable<ProductRoot2> {
        const url = `/products/${id}?populate=*`
        return this.http.get<ProductRoot2>(this.baseUrl + url).pipe(map(data => data as ProductRoot2))
    }
    fetchProductByCategoryId(categoryId: string): Observable<ProductRoot> {
        const url = `/products?filters[categories][id][$eq]=${categoryId}&populate=*`
        return this.http.get<ProductRoot>(this.baseUrl + url).pipe(map(data => data as ProductRoot))
    }
    updateProductBy(product: any,id:number): Observable<any> {
        const url = `${this.baseUrl}/products/${id}?populate=*`
        return this.http.put<any>(url, product)
    }

    fetchCategories(): Observable<CategoriesRoot> {
        const url = '/categories?populate=*'
        return this.http.get<CategoriesRoot>(this.baseUrl + url).pipe(map(data => data as CategoriesRoot))
    }

    addOrder(orderData: any): Observable<any> {
        const url = '/orders'
        return this.http.post<any>(`${this.baseUrl}/orders`, orderData)
    }

    fetchOrderByEmail(email: string): Observable<OrderRoot> {
        const url = `/orders?filters[email][$eq]=${email}`
        return this.http.get<OrderRoot>(this.baseUrl + url).pipe(map(data => data as OrderRoot))
    }

    fetchOrderById(orderId: string): Observable<OrderRoot> {
        const url = `/orders?filters[orderId][$eq]=${orderId}`
        return this.http.get<OrderRoot>(this.baseUrl + url).pipe(map(data => data as OrderRoot))
    }

    fetchReviewByProductId(productId: number): Observable<ReviewRoot> {
        const url = this.baseUrl + `/reviews?filters[product][id][$eq]=${productId}&populate=*`
        return this.http.get<ReviewRoot>(url).pipe(map(data => data))
    }

    addReview(review: any): Observable<any> {
        const url = this.baseUrl + '/reviews'
        return this.http.post<any>(url, review)
    }
    updateReview(review: any, id: number): Observable<any> {
        const url = `${this.baseUrl}/reviews/${id}`
        return this.http.put<any>(url, review)
    }

    addAddress(data: any): Observable<any> {
        const url = `${this.baseUrl}/addresses`
        return this.http.post<any>(url, data)
    }
    updateAddress(data: any, id: number): Observable<any> {
        const url = `${this.baseUrl}/addresses/${id}`
        return this.http.put<any>(url, data)
    }
    fetchAddressByEmail(email: string): Observable<AddressRoot> {
        const url = `${this.baseUrl}/addresses?filters[email][$eq]=${email}&populate=*`
        return this.http.get<AddressRoot>(url).pipe(map(data => data as AddressRoot))
    }
    fetchBanner(): Observable<BannerRoot> {
        const url = `${this.baseUrl}/banners?populate=*`
        return this.http.get<BannerRoot>(url).pipe(map(data => data as BannerRoot))
    }
}
