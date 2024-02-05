import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-aiegl-abbreviation',
  templateUrl: './aiegl-abbreviation.component.html',
  styleUrls: ['./aiegl-abbreviation.component.scss']
})
export class AieglAbbreviationComponent implements OnInit {
  loginUser = null;
  constructor(
    // private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    }
    else
      this.loginUser = null;
  }

}
