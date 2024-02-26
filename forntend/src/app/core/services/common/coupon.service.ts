import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { CouponData, CouponRoot } from '../../models/coupon-codes';


@Injectable({
    providedIn: 'root'
})
export class CouponService {

    private baseUrl = 'http://localhost:1337/api'

    constructor(private http: HttpClient) { }

    fetchCouponByCode(code: string): Observable<CouponData> {
        const url = `/coupon-codes?filters[code][$eq]=${code}`
        return this.http.get<CouponRoot>(this.baseUrl + url).pipe(map(data => data.data[0] as CouponData))
    }

    isCouponValid(sDate: string, eDate: string): boolean {
        const currentDate = new Date();
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        return startDate <= currentDate && endDate >= currentDate;
    }
}
