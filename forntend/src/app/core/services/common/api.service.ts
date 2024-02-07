import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private baseUrl = 'http://localhost:1337/api'

    private token = '843314a7e24e5cd634ac43601994e542ed4cd7924ed0197d00d027aa908265bdf84cc5820bfb15c90a92cdd1dda5adba3c7099522a50ad763927a93725f2e9440ba80c23b2f237ce1873b46150acfb7435e90a9de60a7177757be0b0f44df14852bb118f9995a1660a11c7a281a1fbc47b15992b6b7aef95eaaf071b4bd9f996'


    constructor(private http: HttpClient) {
        localStorage.setItem('session_token', this.token)
    }

    getSessionToken() {
        return localStorage.getItem('session_token');
    }
    fetchProducts(): Observable<any> {
        const token = this.getSessionToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        const url = '/products?populate=*'
        return this.http.get(this.baseUrl + url, { headers })
    }
    fetchProductById(id: string): Observable<any> {
        const token = this.getSessionToken();
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
        const url = `/products/${id}?populate=*`
        return this.http.get(this.baseUrl + url, { headers })
    }
}
