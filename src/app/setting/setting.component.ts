import { Component, OnInit } from '@angular/core';
import { BiblApiService } from '../_service/bibl-api.service';
import {AuthService } from '../_service/auth.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{
  user: any = null;
  isShown = false;

  constructor(
    private apiService: BiblApiService,
    private authService: AuthService,
  ){
  }

  ngOnInit(): void {
    this.getUserInfoForAccount()
  }

  reInit() {
    this.isShown = false;
    setTimeout(() => {
      this.isShown = true;
    });
  }

  getUserInfoForAccount()
  {
    let id =  JSON.parse(this.authService.getToken() || '{}').id;
    this.apiService.getUserInfo(id).subscribe(resp => {
      if (resp !== null) {
        if (resp.length > 0) {
          this.user = resp[0];
        }
      }
    })
  }
}
