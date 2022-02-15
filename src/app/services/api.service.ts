import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable  } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) { }

    apiUrl = "http://api-2207.bs-soft.co.kr/api/customers/test/detections"

    getData():Observable<any>
    {
        return this.http.get(`${this.apiUrl}`);
    }
}