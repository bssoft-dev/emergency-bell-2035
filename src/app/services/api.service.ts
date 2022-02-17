import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) { }
    
    

    apiUrl = "http://api-2207.bs-soft.co.kr/"

    getData():Observable<any>
    {
        return this.http.get(`${this.apiUrl}`);
    }

    login(data:any):Observable<any>
    {
     const headers = new HttpHeaders({"accept":"application/json", "Content-Type":"application/x-www-form-urlencoded"}) 
      return this.http.post(`${this.apiUrl}`+'auth/jwt/login', data, {headers});
    }
    
    register(data:any):Observable<any>
    {
      const headers = new HttpHeaders({"accept":"application/json", "Content-Type":"application/json"}) 
      return this.http.post(`${this.apiUrl}`+'auth/register', data, {headers});
    }

    logout(){
      localStorage.removeItem('currentUser');
    }

    setCurrentUser(user)
    {
      localStorage.setItem('currentUser', user['email']);
    }
}