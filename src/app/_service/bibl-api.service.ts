import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { AuthService } from '../_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BiblApiService {

  private base_url = 'https://fair.classics.ox.ac.uk/bibl_api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
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

  addCreatorVIAF(creator: any, callNumber: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/creators/creator.php`, { creator: creator, callNumber: callNumber, userId: userId, method: 'addCreatorVIAF' });
  }

  addCreatorORCID(creator: any, callNumber: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/creators/creator.php`, { creator: creator, callNumber: callNumber, userId: userId, method: 'addCreatorORCID' });
  }

  getVIAF_ORCIDByCreator(creators: any): Observable<any> {
    let requests = [];
    for (let c of creators) {
      requests.push(this.http.post<any>(`${this.base_url}/creators/creator.php`, { creator: c, method: 'getVIAFByCreator' }));
    }
    return forkJoin(requests);
  }

  getAllBiblioItemLinks(callNumber: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, method: 'getAllBiblioItemLinks' });
  }

  addBiblioItemLink(callNumber: any, link: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, link: link, userId: userId, method: 'addBiblioItemLink' });
  }

  getAllBiblioParentChildItems(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { method: 'getAllBiblioParentChildItems' });
  }

  addBiblioParentChildItem(bibParent: any, bibChild: any, added_by: any) {
    let requests = [];
    for (let sel of bibChild) {
      requests.push(this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`,
        {
          parent_callNumber: bibParent.callNumber,
          child_callNumber: sel.callNumber,
          cat_id: sel.sel_cat,
          added_by: added_by,
          parent_zotero_item_key: bibParent.key,
          child_zotero_item_key: sel.key,
          method: 'addBiblioParentChildItem'
        }
      ));
    }

    return forkJoin(requests);
  }

  getBiblioParentChildItemsByCallNo(callNumber: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, method: 'getBiblioParentChildItemsByCallNo' });
  }

  addBiblioItemParent(callNumber: any, zotero_item_key: any, added_by: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, zotero_item_key: zotero_item_key, added_by: added_by, method: 'addBiblioItemParent' });
  }

  deleteChildItem(parent_callNumber: any, child_callNumber: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`,
      { parent_callNumber: parent_callNumber, child_callNumber: child_callNumber, method: 'deleteChildItem' });
  }

  UpdateChildCategory(bibParent: any, bibChild: any): Observable<any> {
    let requests = [];
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    for (let sel of bibChild.filter((x: any) => x.sel_cat !== undefined)) {
      requests.push(this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`,
        {
          parent_callNumber: bibParent.callNumber,
          child_callNumber: sel.callNumber,
          cat_id: sel.sel_cat,
          userId: userId,
          method: 'UpdateChildCategory'
        }
      ));
    }
    return forkJoin(requests);
  }

  getAllItemResourceTypes(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { method: 'getAllItemResourceTypes' });
  }

  getItemByCallNumber(callNumber: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, method: 'getItemByCallNumber' });
  }

  UpdateItemResourceTypeByCallNumber(callNumber: any, resourceTypeId: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, resourceTypeId: resourceTypeId, userId: userId, method: 'UpdateItemResourceTypeByCallNumber' });
  }

  addItemAbbr(obj: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { itemAbbr: obj, userId: userId, method: 'addItemAbbr' });
  }

  getItemAbbr(callNumber: any, abbr: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, abbr: abbr, method: 'getItemAbbr' });
  }

  addAlternateTitle(obj: any): Observable<any> {
    let userId = JSON.parse(this.authService.getToken() || '{}').id
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { itemTitle: obj, userId: userId, method: 'addAlternateTitle' });
  }

  getAlternateTitle(callNumber: any): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { callNumber: callNumber, method: 'getAlternateTitle' });
  }

  getAllAlternateTitle(): Observable<any> {
    return this.http.post<any>(`${this.base_url}/bibl-items/bibl-item.php`, { method: 'getAllAlternateTitle' });
  }
}

