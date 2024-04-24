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

  copy(format: any) {
    let value = '';

    if (format !== 'html') {
      value = (document.getElementById('citationContent') as HTMLElement).innerText;
    }
    else {
      value = (document.getElementById('citationContent') as HTMLElement).innerHTML;
    }
    value = `<table border="1">${value}</table>`;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert('copied!')
  }

}
