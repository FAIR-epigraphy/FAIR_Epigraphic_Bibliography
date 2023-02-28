import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiblApiService {

  private base_url = 'https://fair.classics.ox.ac.uk/bibl_api';

  constructor(
    private http: HttpClient
  ) { }

  getSEGAbbrByAIEGL(abbr: string): Observable<any> {
    return this.http.get<any>(`${this.base_url}/fetch_aiegl_seg_abbr.php?abbr=${abbr}`);
  }

  getUserInfo(id: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/users/user.php`, { userId: parseInt(id), method: 'getUserInfoById' });
  }

  getAllUsers(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/users/user.php`, { method: 'getAllUsers' });
  }

  getAllRoles(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/users/user.php`, { method: 'getAllRoles' });
  }

  addUser(userName: any, roleId: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/users/user.php`, { userName: userName, roleId: roleId, method: 'addUser' });
  }

  deleteUser(userId: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/users/user.php`, { userId: userId, method: 'deleteUser' });
  }

  addRole(role_name: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/roles/role.php`, { role_name: role_name, method: 'addRole' });
  }

  deleteRole(roleId: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/roles/role.php`, { roleId: roleId, method: 'deleteRole' });
  }

  getAllCategories(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/categories/category.php`, { method: 'getAllCategories' });
  }

  addCategory(cat_name: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/categories/category.php`, { cat_name: cat_name, method: 'addCategory' });
  }

  deleteCategory(catId: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/categories/category.php`, { catId: catId, method: 'deleteCategory' });
  }
}
