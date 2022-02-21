import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) { }
    
    

    apiUrl = "http://api-2207.bs-soft.co.kr/"

    /////////////
    login(data:any):Observable<any>
    {
     const headers = new HttpHeaders({"accept":"application/json", "Content-Type":"application/x-www-form-urlencoded"}) 
      return this.http.post(`${this.apiUrl}`+'auth/jwt/login', data, {headers});
    }

    logout(){
      localStorage.removeItem('currentUser');
    }
    
    register(data:any):Observable<any>
    {
      const headers = new HttpHeaders({"accept":"application/json", "Content-Type":"application/json"}) 
      return this.http.post(`${this.apiUrl}`+'auth/register', data, {headers});
    }


    /////////////
    detectiongraph(data:any):Observable<any>
    {
      return this.http.get(`${this.apiUrl}`+'api/customers/'+`${data}`+'/detections/graph/m');
    }

    detectionstatus(data:any):Observable<any>
    {
      return this.http.get(`${this.apiUrl}`+'api/customers/'+`${data}`+'/detections/text/30');
    }

    alldevice(data:any):Observable<any>
    {
      return this.http.get(`${this.apiUrl}`+'api/customers/'+`${data}`+'/devices/deviceNum');
    }

    alivecheck(data:any):Observable<any>
    {
      return this.http.get(`${this.apiUrl}`+'api/customers/'+`${data}`+'/device/abc/isConnection');
    }

    alldetection(data:any):Observable<any>
    {
      return this.http.get(`${this.apiUrl}`+'api/customers/'+`${data}`+'/detections');
    }

    deviceenroll(data:any):Observable<any>
    {
      return this.http.post(`${this.apiUrl}`+'api/device', data);
    }

    ///////////
    

    
  
}