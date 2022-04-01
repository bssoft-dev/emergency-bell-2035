import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }


  apiUrl = "http://api-2207.bs-soft.co.kr/"
  token = ""
  customer_code = ""

  /////////////
  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" })
    return this.http.post(`${this.apiUrl}` + 'auth/jwt/login', data, { headers });
  }

  logout() {
    sessionStorage.removeItem('currentUser');
  }

  register(data: any): Observable<any> {
    const jsondata = JSON.stringify(data)
    console.log(jsondata, '회원가입데이터')
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json" })
    return this.http.post(`${this.apiUrl}` + 'auth/register', jsondata, { headers });
  }

  // main 페이지
  getoncustomerslogo(data: any): Observable<any> {
    this.token = data[0]
    this.customer_code = data[1]
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${data[0]}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data[1]}`, { headers });
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

  // 회원관리 페이지 
  getallusers(data): Observable<any> {
    this.token = data[0]
    this.customer_code = data[1]
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${data[0]}` })
    return this.http.get(`${this.apiUrl}` + 'users/all?customerCode=' + `${data[1]}`, { headers });
  }
  usersupergrant(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.put(`${this.apiUrl}` + 'users/superGrant/' + `${data[0]}`, data[1], { headers });
  }
  deleteoneuser(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.delete(`${this.apiUrl}` + 'users/' + `${data}?customerCode=` + `${this.customer_code}`, { headers });
  }
  modifyoneuser(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.put(`${this.apiUrl}` + 'users/' + `${data[0]}?customerCode=` + `${this.customer_code}`, data[1], { headers });
  }



  // device페이지
  getalldevices(data): Observable<any> {
    this.token = data[0]
    this.customer_code = data[1]
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${data[0]}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers/' + `${data[1]}` + '/devices', { headers });
  }

  deviceenroll(data: any): Observable<any> {
    const jsondata = JSON.stringify(data)
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.post(`${this.apiUrl}` + 'api/device?customerCode=' + `${this.customer_code}`, jsondata, { headers });
  }
  modifyonedevice(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.put(`${this.apiUrl}` + 'api/device/' + `${data[0]}`, data[1], { headers });
  }
  deleteonedevice(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.delete(`${this.apiUrl}` + 'api/customers/' + `${this.customer_code}` + '/device/' + `${data}`, { headers });
  }


  // customer페이지
  getallcustomers(data: any): Observable<any> {
    this.token = data[0]
    this.customer_code = data[1]
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${data[0]}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers', { headers });
  }
  deleteonecustomer(temp): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.delete(`${this.apiUrl}` + 'api/customers/' + `${temp}`, { headers });
  }
  modifyonecustomer(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.put(`${this.apiUrl}` + 'api/customers/' + `${data[0]}`, data[1], { headers });
  }


  // image업로드
  uploadanal(data: any): Observable<any> {
    const headers = new HttpHeaders({ "Authorization": `Bearer ${this.token}` })
    return this.http.post(`${this.apiUrl}` + 'api/upload', data, { headers });
  }

}