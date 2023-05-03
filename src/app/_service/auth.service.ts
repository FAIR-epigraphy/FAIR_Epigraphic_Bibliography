import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private base_url = 'https://fair.classics.ox.ac.uk/bibl_api/users';
  isUserLoggedIn: boolean = false;

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<any> {
    //this.isUserLoggedIn = userName == 'admin' && password == 'admin';
    //localStorage.setItem('isUserLoggedIn', this.isUserLoggedIn ? "true" : "false");
    return this.http.post<any>(this.base_url + '/auth.php', { username: userName, password: password })
      .pipe(map(user => {
        this.setToken(user)
        return user;
      }));
  }

  //token
  setToken(token: any) {
    if(token !== null)
    {
      localStorage.setItem('loginUser', JSON.stringify(token[0]));
    }
  }
  getToken() {
    return localStorage.getItem('loginUser');
  }
  deleteToken() {
    localStorage.removeItem('loginUser');
  }

  isAuthenticate(): boolean {
    let storeData = this.getToken();
    console.log("StoreData: " + storeData);

    if (storeData != null)
      return true;

    return false;
  }

  logout(): void {
    this.isUserLoggedIn = false;
    this.deleteToken();
  }
}
