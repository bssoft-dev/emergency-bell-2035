import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }


  token = localStorage.getItem("token")
  apiUrl = "http://api-2207.bs-soft.co.kr/"

  /////////////
  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" })
    return this.http.post(`${this.apiUrl}` + 'auth/jwt/login', data, { headers });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  register(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json" })
    return this.http.post(`${this.apiUrl}` + 'auth/register', data, { headers });
  }


  // dashboard 페이지
  detectiongraph(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/detections/graph/m?limit=15', { headers });
  }

  detectionstatus(data: any): Observable<any> {

    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/detections/text/30', { headers });
  }

  alldevice(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/devices/deviceNum', { headers });
  }

  alivecheck(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/devices/isConnection', { headers });
  }

  alldetection(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/detections', { headers });
  }



  // device페이지
  getalldevices(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data}` + '/devices', { headers });
  }

  deviceenroll(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.post(`${this.apiUrl}` + 'api/device', data, { headers });
  }

  // customer페이지
  getallcustomers(): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers', { headers });
  }

}