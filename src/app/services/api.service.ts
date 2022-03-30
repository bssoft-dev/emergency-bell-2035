import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }


  token = localStorage.getItem("token")
  apiUrl = "http://api-2207.bs-soft.co.kr/"
  customer_code = localStorage.getItem('customer_code')

  /////////////
  login(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" })
    return this.http.post(`${this.apiUrl}` + 'auth/jwt/login', data, { headers });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  register(data: any): Observable<any> {
    const jsondata = JSON.stringify(data)
    console.log(jsondata, '회원가입데이터')
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json" })
    return this.http.post(`${this.apiUrl}` + 'auth/register', jsondata, { headers });
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
  getallusers(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'users/all?username=' + `${data}` + '&customerCode=' + `${this.customer_code}`, { headers });
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
  getalldevices(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'users/all?customerCode=' + `${data}`, { headers });
  }

  deviceenroll(data: any): Observable<any> {
    const jsondata = JSON.stringify(data)
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.post(`${this.apiUrl}` + 'api/device?customerCode=' + `${this.customer_code}`, jsondata, { headers });
  }
  modifyonedevice(data: any): Observable<any> {
    const jsondata = JSON.stringify(data)
    const headers = new HttpHeaders({ "accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.put(`${this.apiUrl}` + 'api/customers/' + `${this.customer_code}` + '/device/' + `${data.deviceId}`, jsondata, { headers });
  }
  deleteonedevice(data: any): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.delete(`${this.apiUrl}` + 'api/customers/' + `${this.customer_code}` + '/device/' + `${data}`, { headers });
  }


  // customer페이지
  getallcustomers(): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.get(`${this.apiUrl}` + 'api/customers', { headers });
  }
  deleteonecustomer(temp): Observable<any> {
    const headers = new HttpHeaders({ "accept": "application/json", "Authorization": `Bearer ${this.token}` })
    return this.http.delete(`${this.apiUrl}` + 'api/customers/' + `${temp}`, { headers });
  }

  // image업로드
  uploadanal(data: any): Observable<any> {
    const headers = new HttpHeaders({ "Authorization": `Bearer ${this.token}` })
    return this.http.post(`${this.apiUrl}` + 'api/upload', data, { headers });

  }

}