import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  password: string = '';
  formData: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.formData = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit() {
    // this.formData = new FormGroup({
    //   userName: new FormControl("admin"),
    //   password: new FormControl("admin"),
    // });
  }

  onClickSubmit(data: any) {
    if (data.userName !== '' && data.password !== '') {
      this.userName = data.userName;
      this.password = data.password;

      this.authService.login(this.userName, this.password)
        .subscribe(data => {
          //console.log("Is Login Success: " + data);

          if (data) this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
          else
            this.showToast();
        });
    }
  }

  showToast() {
    document.getElementById('divError')?.classList.add('show')
    setTimeout(() => {
      document.getElementById('divError')?.classList.remove('show')
    }, 3000);
  }
}
