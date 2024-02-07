import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    baseUrl = 'https://jsonplaceholder.typicode.com'
    AUTH_TOKEN = 'auth_token'

    constructor(private httpClient: HttpClient) { }

    get(url: string, params?: any): Observable<any> {
        const data = { params, headers: this.getAuthHeader() }
        return this.httpClient.get(this.baseUrl + url, data).pipe(catchError(this.errorHandler.bind(this)))
    }

    private errorHandler(response: any): Observable<never> {
        const error = response.error
        const keys = Object.keys(error)
        const key = keys[0]
        let message = error[key]
        if (response.status === 401) {
            // auth token delete
            // redirect login page
        }
        if (error[key] instanceof Array) {
            message = error[key][0]
        }
        if (key === 'isTrusted') {
            alert('Check internet connection.')
            // this will occur when not connected to internet
        } else {
            message = key + ':' + message
        }
        // call snackbar and show wrror with message
        return throwError(() => ({
            messages: message,
            error: response.error,
        }));
    }

    private getAuthHeader(): { [header: string]: string | string[] } {
        return {
            Authorization: `Bearer${localStorage.getItem(this.AUTH_TOKEN)}`
        }
    }
}
