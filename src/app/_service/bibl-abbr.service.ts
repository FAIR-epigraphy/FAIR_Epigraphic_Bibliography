import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BiblAbbrService {

  private url = 'https://fair.classics.ox.ac.uk/bibl_api/fetch_aiegl_seg_abbr.php';

  constructor(private http: HttpClient) { }

  getSEGAbbrByAIEGL(abbr: string): Observable<any> {
    return this.http.get<any>(`${this.url}?abbr=${abbr}`);
  }
}
