import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseUrl = 'http://localhost:1337/api'
  public wishListCount: BehaviorSubject<number>;


  constructor(private http: HttpClient) {
    this.wishListCount = new BehaviorSubject<number>(0);
  }

  getWishlistItems(): Observable<any> {
    const url = this.baseUrl + `/my-wish-lists`
    return this.http.get<any>(url)
  }

  addToWishlist(product: { email: string, productId: string }): Observable<any> {
    const url = this.baseUrl + `/my-wish-lists`
    return this.http.post<any>(url, { data: product })
  }

  removeFromWishlist(productId: string): Observable<any> {
    const url = `${this.baseUrl}/my-wish-lists/${productId}`;
    return this.http.delete<any>(url);
  }


}
